var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { GetGlobal, JournalError, DeepCopy, IsObject, GenerateUniqueId, GetDefaultUniqueMarkers, JoinPath, PathToRelative, SplitPath, TidyPath, JournalTry } from "@benbraide/inlinejs";
import { RouterConceptName, ResourceConceptName } from "./names";
import { MatchPath, ProcessPathPlaceholders } from "./utilities/path";
export class RouterConcept {
    constructor(prefix_ = '', origin_ = '') {
        this.prefix_ = prefix_;
        this.origin_ = origin_;
        this.markers_ = GetDefaultUniqueMarkers();
        this.checkpoints_ = { '': 0 };
        this.active_ = false;
        this.middlewares_ = {};
        this.fetchers_ = new Array();
        this.protocolHandlers_ = new Array();
        this.dataHandlers_ = new Array();
        this.pathChangeHandlers_ = new Array();
        this.pages_ = {};
        this.mountPath_ = null;
        this.current_ = {
            path: '',
            params: {},
            page: null,
            initialData: null,
            data: null,
        };
        this.origin_ = (this.origin_ || window.location.origin);
        if (this.origin_) { //Remove trailing slashes
            this.origin_ = this.origin_.replace(/\/+$/, '');
        }
        this.onEvent_ = e => JournalTry(() => this.Load_((e.state || this.mountPath_ || ''), false), 'InlineJS.RouterConcept.PopStateEvent');
    }
    GetOrigin() {
        return this.origin_;
    }
    SetPrefix(prefix) {
        this.prefix_ = prefix;
    }
    GetPrefix() {
        return this.prefix_;
    }
    AddMiddleware(middleware) {
        this.middlewares_[middleware.GetName()] = middleware;
    }
    RemoveMiddleware(middleware) {
        let name = ((typeof middleware === 'string') ? middleware : middleware.GetName());
        if (this.middlewares_.hasOwnProperty(name)) {
            delete this.middlewares_[name];
        }
    }
    AddFetcher(fetcher) {
        this.fetchers_.push({ fetcher, optimized: (ProcessPathPlaceholders(fetcher.GetPath()) || undefined) });
    }
    FindFetcher(path) {
        path = PathToRelative(path, this.origin_);
        let parts = path.split('/').filter(part => !!part), params = {}, info = this.fetchers_.find(info => MatchPath(path, info, params, parts));
        return (info ? { fetcher: info.fetcher, params } : null);
    }
    RemoveFetcher(fetcher) {
        this.fetchers_ = this.fetchers_.filter(info => (info.fetcher !== fetcher));
    }
    AddProtocolHandler(protocol, handler) {
        this.protocolHandlers_.push({ protocol, handler });
        this.checkpoints_[this.GetProtocolString_(protocol)] = 0;
    }
    RemoveProtocolHandler(handler) {
        this.protocolHandlers_ = this.protocolHandlers_.filter((info) => {
            if (info.handler === handler) {
                delete this.checkpoints_[this.GetProtocolString_(info.protocol)];
                return false;
            }
            return true;
        });
    }
    AddDataHandler(handler) {
        this.dataHandlers_.push(handler);
    }
    RemoveDataHandler(handler) {
        this.dataHandlers_ = this.dataHandlers_.filter(h => (h !== handler));
    }
    AddPathChangeHandler(handler) {
        this.pathChangeHandlers_.push(handler);
    }
    RemovePathChangeHandler(handler) {
        this.pathChangeHandlers_ = this.pathChangeHandlers_.filter(h => (h !== handler));
    }
    AddPage(_a) {
        var { path } = _a, rest = __rest(_a, ["path"]);
        let id = GenerateUniqueId(this.markers_, 'router', 'page_');
        this.pages_[id] = Object.assign(Object.assign({}, rest), { id, path: ((typeof path === 'string') ? PathToRelative(path, this.origin_) : path) });
        return id;
    }
    RemovePage(page) {
        let found = this.FindPage(page);
        return (found ? Object.assign({}, found) : null);
    }
    FindPage(page) {
        if (typeof page === 'string') {
            return (this.pages_.hasOwnProperty(page) ? this.pages_[page] : null);
        }
        return (Object.values(this.pages_).find(p => (p.name === page.name)) || null);
    }
    FindMatchingPage(path) {
        return (Object.values(this.pages_).find(p => ((typeof p.path === 'string') ? (p.path === path) : p.path.test(path))) || null);
    }
    Mount(load) {
        var _a;
        window.addEventListener('popstate', this.onEvent_);
        let path = PathToRelative(window.location.href, this.origin_), split = SplitPath(path);
        if (!load) {
            this.current_.path = path;
            this.current_.page = this.FindMatchingPage(split.base);
            this.current_.params = {};
            split.query && this.ResolveQueryParams_(split.query);
            this.pathChangeHandlers_.forEach(handler => JournalTry(() => handler(path), 'InlineJS.RouterConcept.Mount'));
            ((_a = this.current_.page) === null || _a === void 0 ? void 0 : _a.onActive) && JournalTry(() => { var _a; return this.current_.page.onActive(((_a = this.current_.page) === null || _a === void 0 ? void 0 : _a.id) || ''); }, 'InlineJS.RouterConcept.Mount');
            this.current_.page && window.dispatchEvent(new CustomEvent(`${RouterConceptName}.page`, { detail: { page: Object.assign({}, this.current_.page) } }));
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: Object.assign({}, split) } }));
        }
        else {
            this.Load_(split, false);
        }
        this.mountPath_ = split;
    }
    Goto(path, shouldReload, data) {
        let resolvedPath = null;
        if (typeof path !== 'string') {
            if ('name' in path) {
                let page = this.FindPage(path);
                if (page && typeof page.path === 'string') {
                    resolvedPath = SplitPath(page.path, this.origin_);
                }
            }
            else { //Split path
                resolvedPath = {
                    base: PathToRelative(path.base, this.origin_),
                    query: TidyPath(path.query),
                };
            }
        }
        else { //Url provided
            resolvedPath = SplitPath(path, this.origin_);
        }
        if (resolvedPath) { //Valid path
            this.Load_(resolvedPath, true, shouldReload, data);
        }
    }
    Reload() {
        this.Goto(this.current_.path, true);
    }
    GetCurrentPath() {
        return this.current_.path;
    }
    GetCurrentQueryParams() {
        return this.current_.params;
    }
    GetCurrentQueryParam(name) {
        return (this.current_.params.hasOwnProperty(name) ? this.current_.params[name] : null);
    }
    GetActivePage() {
        return this.current_.page;
    }
    GetActivePageData(key) {
        if (key) {
            return ((IsObject(this.current_.data) && this.current_.data.hasOwnProperty(key)) ? this.current_.data[key] : null);
        }
        return this.current_.data;
    }
    GetProtocolString_(protocol) {
        return ((typeof protocol === 'string') ? protocol : protocol.source);
    }
    FindProtocolHandler_(protocol) {
        let info = this.protocolHandlers_.find(info => ((typeof info.protocol === 'string') ? (info.protocol === protocol) : info.protocol.test(protocol)));
        return (info || null);
    }
    Load_(path, pushHistory, shouldReload, data) {
        let protocolMatch = path.base.match(/^([a-zA-Z0-9_]+):\/\//), protocolHandler = (protocolMatch ? this.FindProtocolHandler_(protocolMatch[1]) : null);
        if (protocolHandler) { //Truncate protocol
            path.base = path.base.substring(protocolMatch[1].length + 2);
        }
        let joined = JoinPath(path), protocolHandlerResponse = (protocolHandler ? protocolHandler.handler({ protocol: protocolMatch[1], path: joined }) : null);
        if (protocolHandlerResponse === true) {
            return; //Protocol handled
        }
        let samePath = (this.current_.path === joined);
        if (samePath && !shouldReload && (!IsObject(protocolHandlerResponse) || !protocolHandlerResponse.shouldReload)) {
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.reload`, { detail: { path: Object.assign({}, path), url: joined } }));
            return;
        }
        let page = null;
        if (!protocolHandlerResponse) {
            page = this.FindMatchingPage(path.base);
            if (!page) { //Not found
                this.current_.path = joined;
                if (!samePath) {
                    this.pathChangeHandlers_.forEach(handler => JournalTry(() => handler(joined), 'InlineJS.RouterConcept.Load'));
                    window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: Object.assign({}, path) } }));
                }
                return window.dispatchEvent(new CustomEvent(`${RouterConceptName}.404`, { detail: { path: JoinPath(path) } }));
            }
            if (data) {
                this.current_.initialData = DeepCopy(data);
                this.current_.data = data;
            }
            else if (samePath) { //Use initial if any
                this.current_.data = (DeepCopy(this.current_.initialData) || data);
            }
            else { //Reset
                this.current_.initialData = this.current_.data = null;
            }
            if (!samePath) {
                this.current_.params = {};
                path.query && this.ResolveQueryParams_(path.query);
                this.pathChangeHandlers_.forEach(handler => JournalTry(() => handler(joined), 'InlineJS.RouterConcept.Load'));
            }
        }
        this.SetActiveState_(true);
        window.dispatchEvent(new CustomEvent(`${RouterConceptName}.entered`, { detail: { page: Object.assign({}, page) } }));
        let protocolName = this.GetProtocolString_((protocolHandler === null || protocolHandler === void 0 ? void 0 : protocolHandler.protocol) || '');
        let doLoad = () => this.DoLoad_(checkpoint, page, path, joined, protocolName, pushHistory, (protocolHandlerResponse ? protocolHandlerResponse : undefined));
        let checkpoint = ++this.checkpoints_[protocolName], checkMiddlewares = () => __awaiter(this, void 0, void 0, function* () {
            for (let middleware of ((typeof page.middleware === 'string') ? [page.middleware] : page.middleware)) {
                if (checkpoint !== this.checkpoints_[protocolName] || (this.middlewares_.hasOwnProperty(middleware) && !(yield this.middlewares_[middleware].Handle(joined)))) {
                    if (checkpoint === this.checkpoints_[protocolName]) { //Blocked
                        this.SetActiveState_(false);
                    }
                    return; //Invalid checkpoint OR blocked by middleware
                }
            }
            doLoad();
        });
        if (!protocolHandlerResponse && page.middleware) {
            checkMiddlewares();
        }
        else { //No middlewares to check
            doLoad();
        }
    }
    DoLoad_(checkpoint, page, path, joined, protocolName, pushHistory, dataHandler) {
        var _a, _b;
        if (checkpoint != this.checkpoints_[protocolName]) {
            return;
        }
        if (!dataHandler) {
            if (page.id !== ((_a = this.current_.page) === null || _a === void 0 ? void 0 : _a.id)) { //New page
                document.title = (page.title || 'Untitled');
                this.current_.page = page;
                this.current_.path = joined;
                this.current_.page && this.current_.page.onInactive && JournalTry(() => this.current_.page.onInactive(page.id), 'InlineJS.RouterConcept.Load');
                page.onActive && JournalTry(() => { var _a; return page.onActive(((_a = this.current_.page) === null || _a === void 0 ? void 0 : _a.id) || ''); }, 'InlineJS.RouterConcept.Load');
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.page`, { detail: { page: Object.assign({}, page) } }));
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: Object.assign({}, path) } }));
            }
            else if (this.current_.path !== joined) {
                this.current_.path = joined;
                window.dispatchEvent(new CustomEvent(`${RouterConceptName}.path`, { detail: { path: Object.assign({}, path) } }));
            }
            if (pushHistory) {
                window.history.pushState(path, (page.title || 'Untitled'), joined);
            }
        }
        let url = (typeof dataHandler === 'function') ? joined : ((dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.path) || joined);
        let fetcherInfo = this.FindFetcher(url), handleData = (data) => {
            if (checkpoint == this.checkpoints_[protocolName]) {
                if (!dataHandler) {
                    this.dataHandlers_.slice(0).forEach(handle => JournalTry(() => handle({ data, path, url: joined })), `InlineJS.RouterConcept.HandleData`);
                    window.dispatchEvent(new CustomEvent(`${RouterConceptName}.load`));
                }
                else if (typeof dataHandler === 'function') { //Pass to handler
                    dataHandler(data, path);
                }
                else { //Pass to handler
                    dataHandler.dataHandler(data, path);
                }
            }
            this.SetActiveState_(false);
        };
        let handleError = (err) => {
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.error`, { detail: { path } }));
            this.SetActiveState_(false);
            JournalError(err, 'InlineJS.RouterConcept.Fetch');
        };
        if (!fetcherInfo) { //Network fetch
            url = (this.prefix_ ? PathToRelative(url, this.origin_, this.prefix_) : url);
            if (dataHandler || !page.cache || !GetGlobal().GetConcept(ResourceConceptName)) {
                GetGlobal().GetFetchConcept().Get(url, {
                    method: 'GET',
                    credentials: 'same-origin',
                }).then(res => res.text()).then(handleData).catch(handleError);
            }
            else { //Use resource
                (_b = GetGlobal().GetConcept(ResourceConceptName)) === null || _b === void 0 ? void 0 : _b.GetData(url, true, false).then(handleData).catch(handleError);
            }
        }
        else { //Localized fetch
            fetcherInfo.fetcher.Handle({ path: joined, params: (fetcherInfo.params || {}) }).then(handleData).catch(handleError);
        }
    }
    SetActiveState_(state) {
        if (state != this.active_) {
            this.active_ = state;
            window.dispatchEvent(new CustomEvent(`${RouterConceptName}.active`, { detail: { state } }));
        }
    }
    ResolveQueryParams_(q) {
        let query = new URLSearchParams(q);
        query.forEach((value, key) => {
            let isArray = key.endsWith('[]');
            isArray && (key = key.substring(0, (key.length - 2)));
            if (!this.current_.params.hasOwnProperty(key)) {
                this.current_.params[key] = (isArray ? [value] : value);
            }
            else if (Array.isArray(this.current_.params[key])) {
                this.current_.params[key].push(value);
            }
            else {
                this.current_.params[key] = [this.current_.params[key], value];
            }
        });
    }
}
