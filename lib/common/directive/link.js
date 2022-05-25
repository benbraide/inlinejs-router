"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkRouterDirectiveExtensionCompact = exports.LinkRouterDirectiveExtension = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
exports.LinkRouterDirectiveExtension = (0, inlinejs_1.CreateDirectiveHandlerCallback)('link', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b, _c, _d;
    if (!(contextElement instanceof HTMLAnchorElement) && !(contextElement instanceof HTMLFormElement)) {
        return (0, inlinejs_1.JournalError)('Target must be a anchor or form element.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
    }
    let getPath, getEvent;
    if (contextElement instanceof HTMLFormElement) {
        if (contextElement.method.toLowerCase() !== 'get') {
            return (0, inlinejs_1.JournalError)('Form element must use the GET method.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
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
    let options = (0, inlinejs_1.ResolveOptions)({ options: { reload: false }, list: argOptions }), onEvent = (e) => {
        var _a;
        e.preventDefault();
        e.stopPropagation();
        (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.Goto(getPath(), options.reload);
    };
    let getOrigin = () => { var _a; return (((_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.GetOrigin()) || window.location.origin); };
    let isMatchingPath = (path) => ((0, inlinejs_1.TidyPath)(path) === (0, inlinejs_1.TidyPath)((0, inlinejs_1.PathToRelative)(getPath(), getOrigin())));
    contextElement.addEventListener(getEvent(), onEvent);
    if (expression = expression.trim()) { //Listen for data loads
        let evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression }), isActive = false, pathMonitor = (path) => {
            if (isActive != isMatchingPath(path)) {
                evaluate(undefined, undefined, { active: (isActive = !isActive) });
            }
        };
        (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.AddPathChangeHandler(pathMonitor);
        (_c = (_b = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.AddUninitCallback(() => {
            var _a;
            (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemovePathChangeHandler(pathMonitor);
        });
        pathMonitor(((_d = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _d === void 0 ? void 0 : _d.GetCurrentPath()) || '');
    }
});
function LinkRouterDirectiveExtensionCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.LinkRouterDirectiveExtension, names_1.RouterConceptName);
}
exports.LinkRouterDirectiveExtensionCompact = LinkRouterDirectiveExtensionCompact;
