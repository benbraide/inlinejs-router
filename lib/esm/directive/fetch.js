import { FindComponentById, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, JournalError, IsObject, ToString, AddDirectiveHandler } from "@benbraide/inlinejs";
import { RouterConceptName } from "../names";
import { RouterFetcher } from "../fetcher";
function CallHandler(handler, params) {
    let result = handler(params);
    if (result instanceof Promise) { //Wrap promise
        return new Promise((resolve, reject) => {
            result.then(value => resolve(ToString(value))).catch(err => reject(err));
        });
    }
    return Promise.resolve(ToString(result)); //Return value as a resolved promise
}
export const FetchRouterDirectiveExtension = CreateDirectiveHandlerCallback('fetch', ({ componentId, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)) {
        return JournalError('Target is not a template element.', `${RouterConceptName}:${argKey}`, contextElement);
    }
    let bind = (value) => {
        var _a, _b;
        let handlerInfo = null;
        if (typeof value === 'string' || value instanceof RegExp) { //Path only
            let handler = ({ params }) => {
                let data;
                if (Object.keys(params).length != 0) { //Perform interpolation
                    data = contextElement.innerHTML.replace(/\{\:\s*(.+?)\s*\:\}/g, (match, capture) => {
                        return ToString(EvaluateLater({ componentId, contextElement, expression: capture })(undefined, [params], { params }));
                    });
                }
                else {
                    data = contextElement.innerHTML;
                }
                return Promise.resolve(data);
            };
            handlerInfo = { path: value, handler };
        }
        else if (typeof value === 'function') { //Handle all fetch requests
            handlerInfo = { path: /^.+$/, handler: (params) => CallHandler(value, params) };
        }
        else if (IsObject(value)) {
            let { path, handler } = value;
            handlerInfo = { path, handler: (params) => CallHandler(handler, params) };
        }
        if (handlerInfo) {
            let concept = GetGlobal().GetConcept(RouterConceptName);
            if (concept) {
                let fetcher = new RouterFetcher(handlerInfo.path, handlerInfo.handler);
                concept.AddFetcher(fetcher);
                (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => concept === null || concept === void 0 ? void 0 : concept.RemoveFetcher(fetcher));
            }
        }
        else {
            JournalError('Target path is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
        }
    };
    if (argOptions.includes('evaluate')) {
        EvaluateLater({ componentId, contextElement, expression })(bind);
    }
    else {
        bind(expression);
    }
});
export function FetchRouterDirectiveExtensionCompact() {
    AddDirectiveHandler(FetchRouterDirectiveExtension, RouterConceptName);
}
