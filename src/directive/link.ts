import {
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    FindComponentById,
    GetGlobal,
    JournalError,
    ResolveOptions,
    TidyPath
} from "@benbraide/inlinejs";

import { IRouterConcept, IRouterDataHandlerParams } from "../types";
import { RouterConceptName } from "../names";

export const LinkRouterDirectiveExtension = CreateDirectiveHandlerCallback('link', ({  componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLAnchorElement) && !(contextElement instanceof HTMLFormElement)){
        return JournalError('Target must be a anchor or form element.', `${RouterConceptName}:${argKey}`, contextElement);
    }

    let getPath: () => string, getEvent: () => string;
    if (contextElement instanceof HTMLFormElement){
        if (contextElement.method.toLowerCase() !== 'get'){
            return JournalError('Form element must use the GET method.', `${RouterConceptName}:${argKey}`, contextElement);
        }

        getPath = () => {
            let path = contextElement.action, query = '';
            (new FormData(contextElement)).forEach((value, key) => {
                query = (query ? `${query}&${key}=${value.toString()}` : `${key}=${value.toString()}`);
            });
            return (query ? (path.includes('?') ? `${path}&${query}` : `${path}?${query}`) : path);
        };

        getEvent = () => 'submit';
    }
    else{//Anchor
        getPath = () => contextElement.href;
        getEvent = () => 'click';
    }

    let options = ResolveOptions({ options: { reload: false }, list: argOptions }), onEvent = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.Goto(getPath(), options.reload);
    };

    contextElement.addEventListener(getEvent(), onEvent);
    if (expression = expression.trim()){//Listen for data loads
        let evaluate = EvaluateLater({ componentId, contextElement, expression }), isActive = false, dataSniffer = ({ path }: IRouterDataHandlerParams) => {
            if (isActive != (TidyPath(path.base) === TidyPath(getPath()))){
                evaluate(undefined, undefined, { active: (isActive = !isActive) });
            }
        };

        GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.AddDataHandler(dataSniffer);
        (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => {
            GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemoveDataHandler(dataSniffer);
        });
    }
});

export function LinkRouterDirectiveExtensionCompact(){
    AddDirectiveHandler(LinkRouterDirectiveExtension, RouterConceptName);
}
