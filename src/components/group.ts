import { GetGlobal, IElementScopeCreatedCallbackParams, RetrieveStoredObject, ToString } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IRouterPage } from "../types";

export class RouterGroupElement extends CustomElement{
    private componentId_ = '';
    private pageInfo_: IRouterPage | null = null;
    private middlewares_: Array<string> | null = null;
    
    public constructor(){
        super({
            path: '',
            name: '',
            title: '',
            middleware: '',
            cache: false,
            reload: false,
        });
    }

    public OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams){
        super.OnElementScopeCreated({ componentId, scope, ...rest });

        this.componentId_ = componentId;

        scope.AddPostAttributesProcessCallback(() => {
            let pageData = this.GetParentPageData_();

            this.InitializeStateFromAttributes_();//Update state from attributes
            this.pageInfo_ = <IRouterPage>{
                path: ((pageData && typeof pageData.path === 'string') ? `${pageData.path}${this.state_.path}` : this.ResolvePath_()),
                name: (pageData ? `${pageData.name}${this.state_.name}` : this.state_.name),
                title: (this.state_.title || pageData?.title || ''),
                middleware: this.MergeParentMiddlewares_(pageData),
                cache: (this.state_.cache || pageData?.cache),
                reload: (this.state_.reload || pageData?.reload),
            };
        });
    }

    public GetRouterPageData(){
        return this.pageInfo_;
    }

    protected AttributeChanged_(name: string){
        super.AttributeChanged_(name);

        if (!this.pageInfo_){
            return;
        }

        if (name === 'path'){
            this.pageInfo_.path = this.ResolvePath_();
        }
        else if (name === 'middleware'){
            this.middlewares_ = null;
            this.pageInfo_.middleware = this.MergeParentMiddlewares_();
        }
        else if (name !== 'id' && name !== 'onActive' && name !== 'onInactive' && this.pageInfo_.hasOwnProperty(name)){
            this.pageInfo_[name] = this.state_[name];
        }
    }

    private ResolvePath_(){
        if (!this.state_.path || typeof this.state_.path !== 'string'){
            return '';
        }

        let object = RetrieveStoredObject({
            key: this.state_.path,
            componentId: this.componentId_,
            contextElement: this,
        });

        return ((object instanceof RegExp) ? object : ToString(object));
    }

    private ResolveMiddlewares_(){
        if (!this.middlewares_){
            let middleware = RetrieveStoredObject({
                key: this.state_.middleware,
                componentId: this.componentId_,
                contextElement: this,
            });
            this.middlewares_ = (Array.isArray(middleware) ? middleware.map(m => ToString(m).trim()) : ToString(middleware).split(',').map(m => m.trim()))
        }
        return this.middlewares_;
    }

    private GetParentPageData_(){
        return <IRouterPage | null>((
            this.parentElement &&
            'GetRouterPageData' in this.parentElement &&
            typeof this.parentElement['GetRouterPageData'] === 'function' &&
            (this.parentElement['GetRouterPageData'] as any)()
        ) || null);
    }

    private MergeParentMiddlewares_(pageData?: IRouterPage | null){
        pageData = (pageData || this.GetParentPageData_());
        return (pageData ? [...((typeof pageData.middleware === 'string') ? [pageData.middleware] : (pageData.middleware || [])), ...this.ResolveMiddlewares_()] : this.ResolveMiddlewares_());
    }
}

export function RouterGroupElementCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('router-group'), RouterGroupElement);
}
