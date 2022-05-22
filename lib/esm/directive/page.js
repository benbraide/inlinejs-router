import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, FindComponentById, GetGlobal, IsObject, JournalError, ResolveOptions } from "@benbraide/inlinejs";
import { RouterConceptName } from "../names";
export const PageRouterDirectiveExtension = CreateDirectiveHandlerCallback('page', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)) {
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
    let bind = (value) => {
        var _a, _b, _c, _d;
        let pageId;
        if (typeof value === 'string' || value instanceof RegExp) { //Path specified
            pageId = (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.AddPage({
                path: value,
                cache: options.cache,
                reload: (options.reload && !options.cache),
            });
        }
        else if (IsObject(value)) { //Options specified
            pageId = (_b = GetGlobal().GetConcept(RouterConceptName)) === null || _b === void 0 ? void 0 : _b.AddPage({
                path: value.path,
                name: value.name,
                title: value.title,
                cache: (value.cache || options.cache),
                reload: (value.reload || (options.reload && !options.cache)),
                middleware: value.middleware,
            });
        }
        if (pageId) { //Remove page when element is destroyed
            (_d = (_c = (component || FindComponentById(componentId))) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.AddUninitCallback(() => {
                var _a;
                (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemovePage(pageId);
            });
        }
    };
    if (options.evaluate) {
        EvaluateLater({ componentId, contextElement, expression })(bind);
    }
    else {
        bind(expression);
    }
});
export function PageRouterDirectiveExtensionCompact() {
    AddDirectiveHandler(PageRouterDirectiveExtension, RouterConceptName);
}
