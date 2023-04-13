import {
    GetGlobal,
    JournalError,
    ISplitPath,
    IResourceConcept,
    IUniqueMarkers,
    DeepCopy,
    IsObject,
    GenerateUniqueId,
    GetDefaultUniqueMarkers,
    JoinPath,
    PathToRelative,
    SplitPath,
    TidyPath,
    JournalTry
} from "@benbraide/inlinejs";

import {
    IRouterPageName,
    IRouterConcept,
    IRouterMiddleware,
    IRouterPage,
    IRouterPageOptions,
    IRouterFetcher,
    RouterProtocolHandlerType,
    IRouterFetcherOptimized,
    IRouterFetcherSearchResponse,
    RouterDataHandlerType,
    ValidRouterProtocolHandlerResponseType,
    IRouterProtocolModifyResponse,
    RouterPathChangeHandlerType
} from "./types";

import { RouterConceptName, ResourceConceptName } from "./names";
import { MatchPath, ProcessPathPlaceholders } from "./utilities/path";

interface IRouterProtocolHandlerInfo{
    protocol: string | RegExp;
    handler: RouterProtocolHandlerType;
}

export class RouterConcept implements IRouterConcept{
    private markers_: IUniqueMarkers = GetDefaultUniqueMarkers();
    private onEvent_: (e: PopStateEvent) => void;

    private checkpoints_: Record<string, number> = { '': 0 };
    private active_ = false;
    
    private middlewares_: Record<string, IRouterMiddleware> = {};
    private fetchers_ = new Array<IRouterFetcherOptimized>();
    private protocolHandlers_ = new Array<IRouterProtocolHandlerInfo>();
    private dataHandlers_ = new Array<RouterDataHandlerType>();
    private pathChangeHandlers_ = new Array<RouterPathChangeHandlerType>();
    private pages_: Record<string, IRouterPage> = {};

    private mountPath_: ISplitPath | null = null;

    private current_ = {
        path: '',
        params: <Record<string, Array<string> | string>>{},
        page: <IRouterPage | null>null,
        initialData: <any>null,
        data: <any>null,
    };

    public constructor(private prefix_ = '', private origin_ = ''){
        this.origin_ = (this.origin_ || window.location.origin);
        if (this.origin_){//Remove trailing slashes
            this.origin_ = this.origin_.replace(/\/+$/, '');
        }

        this.onEvent_ = e => JournalTry(() => this.Load_((e.state || this.mountPath_ || ''), false), 'InlineJS.RouterConcept.PopStateEvent');
    }

    public GetOrigin(){
        return this.origin_;
    }
    
    public SetPrefix(prefix: string){
        this.prefix_ = prefix;
    }

    public GetPrefix(){
        return this.prefix_;
    }
    
    public AddMiddleware(middleware: IRouterMiddleware){
        this.middlewares_[middleware.GetName()] = middleware;
    }

    public RemoveMiddleware(middleware: IRouterMiddleware | string){
        let name = ((typeof middleware === 'string') ? middleware : middleware.GetName());
        if (this.middlewares_.hasOwnProperty(name)){
            delete this.middlewares_[name];
        }
    }

    public AddFetcher(fetcher: IRouterFetcher){
        this.fetchers_.push({ fetcher, optimized: (ProcessPathPlaceholders(fetcher.GetPath()) || undefined) });
    }

    public FindFetcher(path: string){
        path = PathToRelative(path, this.origin_);
        let parts = path.split('/').filter(part => !!part), params: Record<string, any> = {}, info = this.fetchers_.find(info => MatchPath(path, info, params, parts));
        return (info ? <IRouterFetcherSearchResponse>{ fetcher: info.fetcher, params } : null);
    }

    public RemoveFetcher(fetcher: IRouterFetcher){
        this.fetchers_ = this.fetchers_.filter(info => (info.fetcher !== fetcher));
    }

    public AddProtocolHandler(protocol: string | RegExp, handler: RouterProtocolHandlerType){
        this.protocolHandlers_.push({ protocol, handler });
        this.checkpoints_[this.GetProtocolString_(protocol)] = 0;
    }

    public RemoveProtocolHandler(handler: RouterProtocolHandlerType){
        this.protocolHandlers_ = this.protocolHandlers_.filter((info) => {
            if (info.handler === handler){
                delete this.checkpoints_[this.GetProtocolString_(info.protocol)];
                return false;
            }
            return true;
        });
    }

    public AddDataHandler(handler: RouterDataHandlerType){
        this.dataHandlers_.push(handler);
    }

    public RemoveDataHandler(handler: RouterDataHandlerType){
        this.dataHandlers_ = this.dataHandlers_.filter(h => (h !== handler));
    }

    public AddPathChangeHandler(handler: RouterPathChangeHandlerType){
        this.pathChangeHandlers_.push(handler);
    }

    public RemovePathChangeHandler(handler: RouterPathChangeHandlerType){
        this.pathChangeHandlers_ = this.pathChangeHandlers_.filter(h => (h !== handler));
    }
    
    public AddPage({ path, ...rest }: IRouterPageOptions){
        let id = GenerateUniqueId(this.markers_, 'router', 'page_');
        this.pages_[id] = { ...rest, id, path: ((typeof path === 'string') ? PathToRelative(path, this.origin_) : path) };
        return id;
    }

    public RemovePage(page: string | IRouterPageName){
        let found = this.FindPage(page);
        return (found ? { ...found } : null);
    }

    public FindPage(page: string | IRouterPageName): IRouterPage | null{
        if (typeof page === 'string'){
            return (this.pages_.hasOwnProperty(page) ? this.pages_[page] : null);
        }
        return (Object.values(this.pages_).find(p => (p.name === page.name)) || null);
    }

    public FindMatchingPage(path: string): IRouterPage | null{
        return (Object.values(this.pages_).find(p => ((typeof p.path === 'string') ? (p.path === path) : p.path.test(path))) || null);
    }
    
    public Mount(load?: boolean){
        window.addEventListener('popstate', this.onEvent_);

        let path = PathToRelative(window.location.href, this.origin_), split = SplitPath(path);
        if (!load){
            this.current_.path = path;
            this.current_.page = this.FindMatchingPage(split.base);

            this.current_.params = {};
            split.query && this.ResolveQueryParams_(split.query);
            
            this.pathChangeHandlers_.forEach(handler => JournalTry(() => handler(path), 'InlineJS.RouterConcept.Mount'));
            this.current_.page?.onActive && JournalTry(() => this.current_.page!.onActive!(this.current_.page?.id || ''), 'InlineJS.RouterConcept.Mount');

            this.current_.page && window.dispatchEvent(new CustomEvent(`${RouterConceptName}.page`, { detail: { page: { ...this.current_.page } } }));
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: { ...split } } }));
        }
        else{
            this.Load_(split, false);
        }

        this.mountPath_ = split;
    }

    public Goto(path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any){
        let resolvedPath: ISplitPath | null = null;
        if (typeof path !== 'string'){
            if ('name' in path){
                let page = this.FindPage(path);
                if (page && typeof page.path === 'string'){
                    resolvedPath = SplitPath(page.path, this.origin_);
                }
            }
            else{//Split path
                resolvedPath = {
                    base: PathToRelative(path.base, this.origin_),
                    query: TidyPath(path.query),
                };
            }
        }
        else{//Url provided
            resolvedPath = SplitPath(path, this.origin_);
        }

        if (resolvedPath){//Valid path
            this.Load_(resolvedPath, true, shouldReload, data);
        }
    }

    public Reload(){
        this.Goto(this.current_.path, true);
    }

    public GetCurrentPath(){
        return this.current_.path;
    }

    public GetCurrentQueryParams(){
        return this.current_.params;
    }

    public GetCurrentQueryParam(name: string){
        return (this.current_.params.hasOwnProperty(name) ? this.current_.params[name] : null);
    }

    public GetActivePage(): IRouterPage | null{
        return this.current_.page;
    }

    public GetActivePageData(key?: string){
        if (key){
            return ((IsObject(this.current_.data) && this.current_.data.hasOwnProperty(key)) ? this.current_.data[key] : null);
        }
        return this.current_.data;
    }

    private GetProtocolString_(protocol: string | RegExp){
        return ((typeof protocol === 'string') ? protocol : protocol.source);
    }

    private FindProtocolHandler_(protocol: string){
        let info = this.protocolHandlers_.find(info => ((typeof info.protocol === 'string') ? (info.protocol === protocol) : info.protocol.test(protocol)));
        return (info || null);
    }

    private Load_(path: ISplitPath, pushHistory?: boolean, shouldReload?: boolean, data?: any){
        let protocolMatch = path.base.match(/^([a-zA-Z0-9_]+):\/\//), protocolHandler = (protocolMatch ? this.FindProtocolHandler_(protocolMatch[1]) : null);
        if (protocolHandler){//Truncate protocol
            path.base = path.base.substring(protocolMatch![1].length + 2);
        }
        
        let joined = JoinPath(path), protocolHandlerResponse = (protocolHandler ? protocolHandler.handler({ protocol: protocolMatch![1], path: joined }) : null);
        if (protocolHandlerResponse === true){
            return;//Protocol handled
        }

        let samePath = (this.current_.path === joined);
        if (samePath && !shouldReload && (!IsObject(protocolHandlerResponse) || !(protocolHandlerResponse as IRouterProtocolModifyResponse).shouldReload)){
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.reload`, { detail: { path: { ...path }, url: joined } }));
            return;
        }
        
        let page: IRouterPage | null = null;
        if (!protocolHandlerResponse){
            page = this.FindMatchingPage(path.base);
            if (!page){//Not found
                this.current_.path = joined;
                if (!samePath){
                    this.pathChangeHandlers_.forEach(handler => JournalTry(() => handler(joined), 'InlineJS.RouterConcept.Load'));
                    window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: { ...path } } }));
                }
                return window.dispatchEvent(new CustomEvent(`${RouterConceptName}.404`, { detail: { path: JoinPath(path) } }));
            }

            if (data){
                this.current_.initialData = DeepCopy(data);
                this.current_.data = data;
            }
            else if (samePath){//Use initial if any
                this.current_.data = (DeepCopy(this.current_.initialData) || data);
            }
            else{//Reset
                this.current_.initialData = this.current_.data = null;
            }

            if (!samePath){
                this.current_.params = {};
                path.query && this.ResolveQueryParams_(path.query);
                this.pathChangeHandlers_.forEach(handler => JournalTry(() => handler(joined), 'InlineJS.RouterConcept.Load'));
            }
        }

        this.SetActiveState_(true);
        window.dispatchEvent(new CustomEvent(`${RouterConceptName}.entered`, { detail: { page: { ...page } } }));

        let protocolName = this.GetProtocolString_(protocolHandler?.protocol || '');
        let doLoad = () => this.DoLoad_(checkpoint, page!, path, joined, protocolName, pushHistory, ( protocolHandlerResponse ? <ValidRouterProtocolHandlerResponseType>protocolHandlerResponse : undefined));

        let checkpoint = ++this.checkpoints_[protocolName], checkMiddlewares = async () => {
            for (let middleware of ((typeof page!.middleware === 'string') ? [page!.middleware] : page!.middleware)!){
                if (checkpoint !== this.checkpoints_[protocolName] || (this.middlewares_.hasOwnProperty(middleware) && !await this.middlewares_[middleware].Handle(joined))){
                    if (checkpoint === this.checkpoints_[protocolName]){//Blocked
                        this.SetActiveState_(false);
                    }
                    return;//Invalid checkpoint OR blocked by middleware
                }
            }

            doLoad();
        };

        if (!protocolHandlerResponse && page!.middleware){
            checkMiddlewares();
        }
        else{//No middlewares to check
            doLoad();
        }
    }

    private DoLoad_(checkpoint: number, page: IRouterPage, path: ISplitPath, joined: string, protocolName: string, pushHistory?: boolean, dataHandler?: ValidRouterProtocolHandlerResponseType){
        if (checkpoint != this.checkpoints_[protocolName]){
            return;
        }

        if (!dataHandler){
            if (page.id !== this.current_.page?.id){//New page
                document.title = (page.title || 'Untitled');
                
                this.current_.page = page;
                this.current_.path = joined;

                this.current_.page && this.current_.page.onInactive && JournalTry(() => this.current_.page!.onInactive!(page.id), 'InlineJS.RouterConcept.Load');
                page.onActive && JournalTry(() => page.onActive!(this.current_.page?.id || ''), 'InlineJS.RouterConcept.Load');
                
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.page`, { detail: { page: { ...page } } }));
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: { ...path } } }));
            }
            else if (this.current_.path !== joined){
                this.current_.path = joined;
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: { ...path } } }));
            }
    
            if (pushHistory){
                window.history.pushState(path, (page.title || 'Untitled'), joined);
            }
        }

        let url = (typeof dataHandler === 'function') ? joined : (dataHandler?.path || joined);
        let fetcherInfo = this.FindFetcher(url), handleData = (data: string) => {
            if (checkpoint == this.checkpoints_[protocolName]){
                if (!dataHandler){
                    this.dataHandlers_.slice(0).forEach(handle => JournalTry(() => handle({ data, path, url: joined })), `InlineJS.RouterConcept.HandleData`);
                    window.dispatchEvent(new CustomEvent(`${RouterConceptName}.load`));
                }
                else if (typeof dataHandler === 'function'){//Pass to handler
                    dataHandler(data, path);
                }
                else{//Pass to handler
                    dataHandler.dataHandler(data, path);
                }
            }
            
            this.SetActiveState_(false);
        };

        let handleError = (err: any) => {
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.error`, { detail: { path } }));
            this.SetActiveState_(false);
            JournalError(err, 'InlineJS.RouterConcept.Fetch');
        };

        if (!fetcherInfo){//Network fetch
            url = (this.prefix_ ? PathToRelative(url, this.origin_, this.prefix_) : url);
            if (dataHandler || !page.cache || !GetGlobal().GetConcept<IResourceConcept>(ResourceConceptName)){
                GetGlobal().GetFetchConcept().Get(url, {
                    method: 'GET',
                    credentials: 'same-origin',
                }).then(res => res.text()).then(handleData).catch(handleError);
            }
            else{//Use resource
                GetGlobal().GetConcept<IResourceConcept>(ResourceConceptName)?.GetData(url, true, false).then(handleData).catch(handleError);
            }
        }
        else{//Localized fetch
            fetcherInfo.fetcher.Handle({ path: joined, params: (fetcherInfo.params || {} )}).then(handleData).catch(handleError);
        }
    }

    private SetActiveState_(state: boolean){
        if (state != this.active_){
            this.active_ = state;
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.active`, { detail: { state } }));
        }
    }

    private ResolveQueryParams_(q: string){
        let query = new URLSearchParams(q);
        query.forEach((value, key) => {
            let isArray = key.endsWith('[]');

            isArray && (key = key.substring(0, (key.length - 2)));
            if (!this.current_.params.hasOwnProperty(key)){
                this.current_.params[key] = (isArray ? [value] : value);
            }
            else if (Array.isArray(this.current_.params[key])){
                (this.current_.params[key] as Array<string>).push(value);
            }
            else{
                this.current_.params[key] = [(this.current_.params[key] as string), value];
            }
        });
    }
}
