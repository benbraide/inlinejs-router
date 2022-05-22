import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, FindComponentById, GetGlobal, JournalError, ResolveOptions, TidyPath } from "@benbraide/inlinejs";
import { RouterConceptName } from "../names";
export const LinkRouterDirectiveExtension = CreateDirectiveHandlerCallback('link', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b, _c;
    if (!(contextElement instanceof HTMLAnchorElement) && !(contextElement instanceof HTMLFormElement)) {
        return JournalError('Target must be a anchor or form element.', `${RouterConceptName}:${argKey}`, contextElement);
    }
    let getPath, getEvent;
    if (contextElement instanceof HTMLFormElement) {
        if (contextElement.method.toLowerCase() !== 'get') {
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
    else { //Anchor
        getPath = () => contextElement.href;
        getEvent = () => 'click';
    }
    let options = ResolveOptions({ options: { reload: false }, list: argOptions }), onEvent = (e) => {
        var _a;
        e.preventDefault();
        e.stopPropagation();
        (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.Goto(getPath(), options.reload);
    };
    contextElement.addEventListener(getEvent(), onEvent);
    if (expression = expression.trim()) { //Listen for data loads
        let evaluate = EvaluateLater({ componentId, contextElement, expression }), isActive = false, dataSniffer = ({ path }) => {
            if (isActive != (TidyPath(path.base) === TidyPath(getPath()))) {
                evaluate(undefined, undefined, { active: (isActive = !isActive) });
            }
        };
        (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.AddDataHandler(dataSniffer);
        (_c = (_b = (component || FindComponentById(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.AddUninitCallback(() => {
            var _a;
            (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemoveDataHandler(dataSniffer);
        });
    }
});
export function LinkRouterDirectiveExtensionCompact() {
    AddDirectiveHandler(LinkRouterDirectiveExtension, RouterConceptName);
}
