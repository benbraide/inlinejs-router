import {
    FindComponentById,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    GetGlobal,
    JournalError,
    IsObject,
    ToString,
    AddDirectiveHandler,
    ResolveOptions
} from "@benbraide/inlinejs";

import { IRouterConcept, IRouterFetcherHandlerParams } from "../types";
import { RouterConceptName } from "../names";
import { RouterFetcher } from "../fetcher";

interface IRouterFetcherHandlerInfo{
    path: string | RegExp;
    handler: (params: IRouterFetcherHandlerParams) => any;
}

function CallHandler(handler: (params: IRouterFetcherHandlerParams) => any, params: IRouterFetcherHandlerParams){
    let result = handler(params);
    if (result instanceof Promise){//Wrap promise
        return new Promise<string>((resolve, reject) => {
            (result as Promise<any>).then(value => resolve(ToString(value))).catch(err => reject(err));
        });
    }

    return Promise.resolve(ToString(result));//Return value as a resolved promise
}

export const FetchRouterDirectiveExtension = CreateDirectiveHandlerCallback('fetch', ({ componentId, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)){
        return JournalError('Target is not a template element.', `${RouterConceptName}:${argKey}`, contextElement);
    }

    let bind = (value: any) => {
        let handlerInfo: IRouterFetcherHandlerInfo | null = null;
        if (typeof value === 'string' || value instanceof RegExp){//Path only
            let handler = ({ params }: IRouterFetcherHandlerParams) => {
                let data: string;
                if (Object.keys(params).length != 0){//Perform interpolation
                    data = contextElement.innerHTML.replace(/\{\:\s*(.+?)\s*\:\}/g, (match, capture) => {//Supports {: [Expression] :}
                        return ToString(EvaluateLater({ componentId, contextElement, expression: capture })(undefined, [params], { params }));
                    });
                }
                else{
                    data = contextElement.innerHTML;
                }
                return Promise.resolve(data);
            };
            handlerInfo = { path: value, handler };
        }
        else if (typeof value === 'function'){//Handle all fetch requests
            handlerInfo = { path: /^.+$/, handler: (params) => CallHandler(value, params) };
        }
        else if (IsObject(value)){
            let { path, handler } = <IRouterFetcherHandlerInfo>value;
            handlerInfo = <IRouterFetcherHandlerInfo>{ path, handler: (params) => CallHandler(handler, params) };
        }
        
        if (handlerInfo){
            let concept = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName);
            if (concept){
                let fetcher = new RouterFetcher(handlerInfo.path, handlerInfo.handler);
                concept.AddFetcher(fetcher);
                FindComponentById(componentId)?.FindElementScope(contextElement)?.AddUninitCallback(() => concept?.RemoveFetcher(fetcher));
            }
        }
        else{
            JournalError('Target path is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
        }
    };

    if (argOptions.includes('evaluate')){
        EvaluateLater({ componentId, contextElement, expression })(bind);
    }
    else{
        bind(expression);
    }
});

export function FetchRouterDirectiveExtensionCompact(){
    AddDirectiveHandler(FetchRouterDirectiveExtension, RouterConceptName);
}
