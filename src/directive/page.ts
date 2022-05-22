import {
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    FindComponentById,
    GetGlobal,
    IsObject,
    JournalError,
    ResolveOptions
} from "@benbraide/inlinejs";

import { IRouterConcept, IRouterPageOptions } from "../types";
import { RouterConceptName } from "../names";

export const PageRouterDirectiveExtension = CreateDirectiveHandlerCallback('page', ({  componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)){
        return JournalError('Target is not a template element.', `${RouterConceptName}:${argKey}`, contextElement);
    }

    let options = ResolveOptions({
        options: {
            cache: false,
            reload: false,
            evaluate: false,
        },
        list: argOptions,
    });

    let bind = (value: any) => {
        let pageId: string | undefined;
        if (typeof value === 'string' || value instanceof RegExp){//Path specified
            pageId = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.AddPage({
                path: value,
                cache: options.cache,
                reload: (options.reload && !options.cache),
            });
        }
        else if (IsObject(value)){//Options specified
            pageId = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.AddPage({
                path: (value as IRouterPageOptions).path,
                name: (value as IRouterPageOptions).name,
                title: (value as IRouterPageOptions).title,
                cache: ((value as IRouterPageOptions).cache || options.cache),
                reload: ((value as IRouterPageOptions).reload || (options.reload && !options.cache)),
                middleware: (value as IRouterPageOptions).middleware,
            });
        }

        if (pageId){//Remove page when element is destroyed
            (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => {
                GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemovePage(pageId!);
            });
        }
    };

    if (options.evaluate){
        EvaluateLater({ componentId, contextElement, expression })(bind);
    }
    else{
        bind(expression);
    }
});

export function PageRouterDirectiveExtensionCompact(){
    AddDirectiveHandler(PageRouterDirectiveExtension, RouterConceptName);
}
