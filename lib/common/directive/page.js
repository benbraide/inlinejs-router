"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageRouterDirectiveExtensionCompact = exports.PageRouterDirectiveExtension = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
exports.PageRouterDirectiveExtension = (0, inlinejs_1.CreateDirectiveHandlerCallback)('page', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)) {
        return (0, inlinejs_1.JournalError)('Target is not a template element.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
    }
    let options = (0, inlinejs_1.ResolveOptions)({
        options: {
            cache: false,
            reload: false,
            evaluate: false,
        },
        list: argOptions,
    });
    let bind = (value) => {
        var _a, _b, _c, _d;
        let pageId;
        if (typeof value === 'string' || value instanceof RegExp) { //Path specified
            pageId = (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.AddPage({
                path: value,
                cache: options.cache,
                reload: (options.reload && !options.cache),
            });
        }
        else if ((0, inlinejs_1.IsObject)(value)) { //Options specified
            pageId = (_b = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _b === void 0 ? void 0 : _b.AddPage({
                path: value.path,
                name: value.name,
                title: value.title,
                cache: (value.cache || options.cache),
                reload: (value.reload || (options.reload && !options.cache)),
                middleware: value.middleware,
            });
        }
        if (pageId) { //Remove page when element is destroyed
            (_d = (_c = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.AddUninitCallback(() => {
                var _a;
                (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemovePage(pageId);
            });
        }
    };
    if (options.evaluate) {
        (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })(bind);
    }
    else {
        bind(expression);
    }
});
function PageRouterDirectiveExtensionCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.PageRouterDirectiveExtension, names_1.RouterConceptName);
}
exports.PageRouterDirectiveExtensionCompact = PageRouterDirectiveExtensionCompact;
