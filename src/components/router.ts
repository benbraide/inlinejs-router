import { EvaluateLater, GetGlobal, IElementScopeCreatedCallbackParams, JournalError } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { RouterConceptName, RouterEvents } from "../names";
import { IRouterConcept } from "../types";

export class RouterElement extends CustomElement{
    public constructor(){
        super({
            prefix: '',
            onload: '',
            onreload: '',
            onerror: '',
            on404: '',
            onentered: '',
            onpage: '',
            onpath: '',
            mount: false,
            load: false,
        });
    }

    public OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams){
        super.OnElementScopeCreated({ componentId, scope, ...rest });

        scope.AddPostAttributesProcessCallback(() => {
            let concept = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName);
            if (!concept){
                return JournalError(`${RouterConceptName} concept is not installed.`, GetGlobal().GetConfig().GetElementName('router'), this);
            }

            this.InitializeStateFromAttributes_();//Update state from attributes
            this.state_.prefix && concept.SetPrefix(this.state_.prefix);

            let handlers: Record<string, (e: Event) => void> = {};
            RouterEvents.forEach((event) => {
                globalThis.addEventListener(`${RouterConceptName}.${event}`, (handlers[event] = (e) => {
                    if (this.state_[`on${event}`]){
                        EvaluateLater({
                            componentId,
                            contextElement: this,
                            expression: this.state_[`on${event}`],
                            disableFunctionCall: false,
                        })(undefined, undefined, { event: e });
                    }
                }));
            });

            this.state_.mount && concept.Mount(this.state_.load);
        });
    }

    protected AttributeChanged_(name: string){
        super.AttributeChanged_(name);
        (name === 'prefix') && GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.SetPrefix(this.state_.prefix);
    }
}

export function RouterElementCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('router'), RouterElement);
}
