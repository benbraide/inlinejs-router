"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchRouterDirectiveExtensionCompact = exports.FetchRouterDirectiveExtension = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
const fetcher_1 = require("../fetcher");
function CallHandler(handler, params) {
    let result = handler(params);
    if (result instanceof Promise) { //Wrap promise
        return new Promise((resolve, reject) => {
            result.then(value => resolve((0, inlinejs_1.ToString)(value))).catch(err => reject(err));
        });
    }
    return Promise.resolve((0, inlinejs_1.ToString)(result)); //Return value as a resolved promise
}
exports.FetchRouterDirectiveExtension = (0, inlinejs_1.CreateDirectiveHandlerCallback)('fetch', ({ componentId, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)) {
        return (0, inlinejs_1.JournalError)('Target is not a template element.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
    }
    let bind = (value) => {
        var _a, _b;
        let handlerInfo = null;
        if (typeof value === 'string' || value instanceof RegExp) { //Path only
            let handler = ({ params }) => {
                let data;
                if (Object.keys(params).length != 0) { //Perform interpolation
                    data = contextElement.innerHTML.replace(/\{\:\s*(.+?)\s*\:\}/g, (match, capture) => {
                        return (0, inlinejs_1.ToString)((0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression: capture })(undefined, [params], { params }));
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
        else if ((0, inlinejs_1.IsObject)(value)) {
            let { path, handler } = value;
            handlerInfo = { path, handler: (params) => CallHandler(handler, params) };
        }
        if (handlerInfo) {
            let concept = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName);
            if (concept) {
                let fetcher = new fetcher_1.RouterFetcher(handlerInfo.path, handlerInfo.handler);
                concept.AddFetcher(fetcher);
                (_b = (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => concept === null || concept === void 0 ? void 0 : concept.RemoveFetcher(fetcher));
            }
        }
        else {
            (0, inlinejs_1.JournalError)('Target path is invalid.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
        }
    };
    if (argOptions.includes('evaluate')) {
        (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })(bind);
    }
    else {
        bind(expression);
    }
});
function FetchRouterDirectiveExtensionCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.FetchRouterDirectiveExtension, names_1.RouterConceptName);
}
exports.FetchRouterDirectiveExtensionCompact = FetchRouterDirectiveExtensionCompact;
