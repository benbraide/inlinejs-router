import { GetGlobal, EvaluateLater, ToString, IElementScopeCreatedCallbackParams, RetrieveStoredObject, IsObject } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IRouterConcept, IRouterPage, IRouterFetcher } from "../types";
import { RouterConceptName } from "../names";
import { RouterFetcher } from "../fetcher";

export class RouterFetchElement extends CustomElement{
    private componentId_ = '';
    private fetcher_: IRouterFetcher | null = null;
    
    public constructor(){
        super({
            path: '',
        });
    }

    public OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams){
        super.OnElementScopeCreated({ componentId, scope, ...rest });

        this.componentId_ = componentId;
        scope.AddPostAttributesProcessCallback(() => this.InitFetcher_());
        
        scope.AddUninitCallback(() => {//Remove fetcher when element is destroyed
            this.fetcher_ && GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemoveFetcher(this.fetcher_);
            this.fetcher_ = null;
        });
    }

    protected AttributeChanged_(name: string){
        super.AttributeChanged_(name);

        if (name === 'path'){
            this.fetcher_ && GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemoveFetcher(this.fetcher_);
            this.InitFetcher_();
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

        if (IsObject(object) && object.hasOwnProperty('path')){
            return object.path;
        }

        return ((object instanceof RegExp) ? object : ToString(object));
    }

    private GetParentPageData_(){
        return <IRouterPage | null>((
            this.parentElement &&
            'GetRouterPageData' in this.parentElement &&
            typeof this.parentElement['GetRouterPageData'] === 'function' &&
            (this.parentElement['GetRouterPageData'] as any)()
        ) || null);
    }

    private InitFetcher_(){
        let pageData = this.GetParentPageData_();
        
        this.InitializeStateFromAttributes_();//Update state from attributes
        this.fetcher_ = new RouterFetcher((this.ResolvePath_() || pageData?.path || ''), ({ params }) => {
            let data: string;
            if (Object.keys(params).length != 0){//Perform interpolation
                data = this.innerHTML.replace(/\{\:\s*(.+?)\s*\:\}/g, (match, capture) => {//Supports {: [Expression] :}
                    return ToString(EvaluateLater({ componentId: this.componentId_, contextElement: this, expression: capture })(undefined, [params], { params }));
                });
            }
            else{
                data = this.innerHTML;
            }
            return Promise.resolve(data);
        });

        GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.AddFetcher(this.fetcher_);
    }
}

export function RouterFetchElementCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('router-fetch'), RouterFetchElement);
}
