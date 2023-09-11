import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { RouterPathElement } from "./path";
import { FetchPathHandlerType, GetGlobal, IElementScopeCreatedCallbackParams, IExtendedFetchConcept, IFetchPathHandlerParams, TidyPath } from "@benbraide/inlinejs";
import { IRouterConcept } from "../types";
import { RouterConceptName } from "../names";

export class RouterMock extends RouterPathElement{
    @Property({ type: 'number' })
    public delay = 0;
    
    public constructor(){
        super();
    }

    public OnElementScopeCreated({ scope, ...rest }: IElementScopeCreatedCallbackParams){
        this.HandleElementScopeCreated_({ scope, ...rest }, () => {
            let path = this.ComputePath_();
            if (typeof path !== 'string' || !path){
                return;
            }
            
            let pathPrefix = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.GetPrefix();
            if (pathPrefix){
                path = (path.startsWith('/') ? `${pathPrefix}${path}` : `${pathPrefix}/${path}`);
            }
            
            const fetchHandler: FetchPathHandlerType = () => {
                const response = GetGlobal().GetConcept<IExtendedFetchConcept>('extended_fetch')?.MockResponse({
                    response: this.innerHTML,
                    delay: this.delay,
                });
                return (response || Promise.resolve(new Response));
            };

            GetGlobal().GetConcept<IExtendedFetchConcept>('extended_fetch')?.AddPathHandler(path, fetchHandler);

            scope.AddUninitCallback(() => GetGlobal().GetConcept<IExtendedFetchConcept>('extended_fetch')?.RemovePathHandler(fetchHandler));
        });
    }
}

export function RouterMockElementCompact(){
    RegisterCustomElement(RouterMock);
}
