import { GetGlobal, EvaluateLater, IElementScopeCreatedCallbackParams, RetrieveStoredObject, ToString } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IRouterConcept, IRouterPage } from "../types";
import { RouterConceptName } from "../names";

export class RouterPageElement extends CustomElement{
    private id_ = '';
    private componentId_ = '';
    private middlewares_: Array<string> | null = null;
    
    public constructor(){
        super({
            path: '',
            name: '',
            title: '',
            middleware: '',
            onactive: '',
            oninactive: '',
            cache: false,
            reload: false,
        });
    }

    public OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams){
        super.OnElementScopeCreated({ componentId, scope, ...rest });

        this.componentId_ = componentId;
        
        scope.AddPostAttributesProcessCallback(() => {
            let pageData = this.GetParentPageData_();

            const executeExpression = (exp: string, id: string) => {
                if (!exp || exp.substring(0, 2) !== 'on' || !this.state_.hasOwnProperty(exp) || typeof this.state_[exp] !== 'string'){
                    return;
                }

                const evaluate = EvaluateLater({
                    componentId,
                    contextElement: this,
                    expression: this.state_[exp],
                    disableFunctionCall: false,
                });

                evaluate(undefined, undefined, {
                    event: new CustomEvent(`${RouterConceptName}.page.${exp.substring(2)}`, {
                        detail: { id },
                    }),
                });
            };

            this.InitializeStateFromAttributes_();//Update state from attributes
            let pageId = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.AddPage({
                path: ((pageData && typeof pageData.path === 'string') ? `${pageData.path}${this.state_.path}` : this.ResolvePath_()),
                name: (pageData ? `${pageData.name}${this.state_.name}` : this.state_.name),
                title: (this.state_.title || pageData?.title || ''),
                middleware: this.MergeParentMiddlewares_(pageData),
                onActive: (id) => {
                    executeExpression('onactive', id);
                    pageData?.onActive && pageData.onActive(id);
                },
                onInactive: (id) => {
                    executeExpression('oninactive', id);
                    pageData?.onInactive && pageData.onInactive(id);
                },
                cache: (this.state_.cache || pageData?.cache),
                reload: (this.state_.reload || pageData?.reload),
            });

            if (pageId){
                this.id_ = pageId;
                scope.AddUninitCallback(() => {//Remove page when element is destroyed
                    let pageData = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.FindPage(pageId!);
                    if (pageData){
                        pageData.onActive = pageData.onInactive = undefined;
                    }
                    GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemovePage(pageId!);
                });
            }
        });
    }

    public GetRouterPageData(){
        return GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.FindPage(this.id_);
    }

    protected AttributeChanged_(name: string){
        super.AttributeChanged_(name);

        let page = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.FindPage(this.id_);
        if (!page){
            return;
        }

        if (name === 'path'){
            page.path = this.ResolvePath_();
        }
        else if (name === 'middleware'){
            this.middlewares_ = null;
            page.middleware = this.MergeParentMiddlewares_();
        }
        else if (name !== 'id' && name !== 'onActive' && name !== 'onInactive' && page.hasOwnProperty(name)){
            page[name] = this.state_[name];
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

export function RouterPageElementCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('router-page'), RouterPageElement);
}
