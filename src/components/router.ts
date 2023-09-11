import { GetGlobal, IElementScopeCreatedCallbackParams, JournalError } from "@benbraide/inlinejs";
import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { RouterConceptName } from "../names";
import { IRouterConcept } from "../types";
import { RouterElement } from "./base";

export class Router extends RouterElement{
    @Property({ type: 'string' })
    public UpdatePrefixProperty(value: string){
        GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.SetPrefix(value);
    }

    @Property({ type: 'boolean' })
    public mount = false;

    @Property({ type: 'boolean' })
    public load = false;

    public constructor(){
        super();
    }

    public OnElementScopeCreated(params: IElementScopeCreatedCallbackParams){
        this.HandleElementScopeCreated_(params, () => {
            const concept = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName);
            if (concept){
                this.mount && concept.Mount(this.load);   
            }
            else{
                JournalError(`${RouterConceptName} concept is not installed.`, GetGlobal().GetConfig().GetElementName('router'), this);
            }
        });
    }
}

export function RouterElementCompact(){
    RegisterCustomElement(Router);
}
