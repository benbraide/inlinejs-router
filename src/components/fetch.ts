import { GetGlobal, EvaluateLater, ToString, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { IRouterConcept, IRouterFetcher } from "../types";
import { RouterConceptName } from "../names";
import { RouterFetcher } from "../fetcher";
import { RouterPathElement } from "./path";

export class RouterFetch extends RouterPathElement{
    protected fetcher_: IRouterFetcher | null = null;

    public constructor(){
        super();
    }

    public OnElementScopeCreated({ scope, ...rest }: IElementScopeCreatedCallbackParams){
        this.HandleElementScopeCreated_({ scope, ...rest }, () => this.UpdateFetcher_());
        scope.AddUninitCallback(() => {//Remove fetcher when element is destroyed
            this.fetcher_ && GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemoveFetcher(this.fetcher_);
            this.fetcher_ = null;
        });
    }

    protected PostPathUpdate_(shouldUpdate?: boolean){
        shouldUpdate && this.UpdateFetcher_();
    }

    protected UpdateFetcher_(){
        this.fetcher_ = new RouterFetcher((this.ComputePath_() || ''), ({ params }) => {
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
    RegisterCustomElement(RouterFetch);
}
