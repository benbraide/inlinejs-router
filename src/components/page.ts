import { GetGlobal, EvaluateLater, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { IRouterConcept } from "../types";
import { RouterConceptName } from "../names";
import { RouterBasePageElement } from "./base-page";

export class RouterPage extends RouterBasePageElement{
    protected id_ = '';

    public constructor(){
        super();
    }

    public OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams){
        this.HandleElementScopeCreated_({ componentId, scope, ...rest }, () => {
            const pageData = this.GetRouterPageData(), executeExpression = (exp: string, id: string) => {
                if (!exp){
                    return;
                }

                const evaluate = EvaluateLater({
                    componentId,
                    contextElement: this,
                    expression: this[exp],
                    disableFunctionCall: false,
                });

                evaluate(undefined, undefined, {
                    event: new CustomEvent(`${RouterConceptName}.page.${exp.substring(2)}`, {
                        detail: { id },
                    }),
                });
            };

            const { onActive, onInactive } = pageData, pageId = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.AddPage({
                path: pageData.path,
                name: pageData.name,
                title: pageData.title,
                middleware: pageData.middleware,
                onActive: (id) => {
                    executeExpression(this.onactive, id);
                    onActive && onActive(id);
                },
                onInactive: (id) => {
                    executeExpression(this.oninactive, id);
                    onInactive && onInactive(id);
                },
                cache: pageData.cache,
                reload: pageData.reload,
            });

            if (pageId){
                this.id_ = pageId;
                scope.AddUninitCallback(() => {//Remove page when element is destroyed
                    let pageData = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.FindPage(pageId!);
                    pageData && (pageData.onActive = pageData.onInactive = undefined);
                    GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemovePage(pageId!);
                });
            }
        });
    }

    protected GetId_(){
        return this.id_;
    }
}

export function RouterPageElementCompact(){
    RegisterCustomElement(RouterPage);
}
