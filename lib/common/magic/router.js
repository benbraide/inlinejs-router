"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterMagicHandlerCompact = exports.RouterMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
function CreateRouterProxy() {
    const getConcept = () => (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName);
    let methods = {
        setPrefix: (prefix) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.SetPrefix(prefix); },
        getPrefix: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.GetPrefix(); },
        addMiddleware: (middleware) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.AddMiddleware(middleware); },
        removeMiddleware: (middleware) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.RemoveMiddleware(middleware); },
        addFetcher: (fetcher) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.AddFetcher(fetcher); },
        removeFetcher: (fetcher) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.RemoveFetcher(fetcher); },
        addProtocolHandler: (protocol, handler) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.AddProtocolHandler(protocol, handler); },
        removeProtocolHandler: (handler) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.RemoveProtocolHandler(handler); },
        addPage: (page) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.AddPage(page); },
        removePage: (page) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.RemovePage(page); },
        findPage: (page) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.FindPage(page); },
        findMatchingPage: (path) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.FindMatchingPage(path); },
        mount: (load) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Mount(load); },
        goto: (path, shouldReload, data) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Goto(path, shouldReload, data); },
        reload: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.Reload(); },
        getCurrentPath: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.GetCurrentPath(); },
        getCurrentQueryParams: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.GetCurrentQueryParams(); },
        getCurrentQueryParam: (name) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.GetCurrentQueryParam(name); },
        getActivePage: () => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.GetActivePage(); },
        getActivePageData: (key) => { var _a; return (_a = getConcept()) === null || _a === void 0 ? void 0 : _a.GetActivePageData(key); },
    };
    return (0, inlinejs_1.CreateReadonlyProxy)(methods);
}
const RouterProxy = CreateRouterProxy();
exports.RouterMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)(names_1.RouterConceptName, () => RouterProxy);
function RouterMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.RouterMagicHandler);
}
exports.RouterMagicHandlerCompact = RouterMagicHandlerCompact;
