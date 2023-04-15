"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterPageElementCompact = exports.RouterPageElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const names_1 = require("../names");
class RouterPageElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            path: '',
            name: '',
            title: '',
            middleware: '',
            onactive: '',
            oninactive: '',
            cache: false,
            reload: false,
        });
        this.id_ = '';
        this.componentId_ = '';
        this.middlewares_ = null;
    }
    OnElementScopeCreated(_a) {
        var { componentId, scope } = _a, rest = __rest(_a, ["componentId", "scope"]);
        super.OnElementScopeCreated(Object.assign({ componentId, scope }, rest));
        this.componentId_ = componentId;
        scope.AddPostAttributesProcessCallback(() => {
            var _a;
            let pageData = this.GetParentPageData_();
            const executeExpression = (exp, id) => {
                if (!exp || exp.substring(0, 2) !== 'on' || !this.state_.hasOwnProperty(exp) || typeof this.state_[exp] !== 'string') {
                    return;
                }
                const evaluate = (0, inlinejs_1.EvaluateLater)({
                    componentId,
                    contextElement: this,
                    expression: this.state_[exp],
                    disableFunctionCall: false,
                });
                evaluate(undefined, undefined, {
                    event: new CustomEvent(`${names_1.RouterConceptName}.page.${exp.substring(2)}`, {
                        detail: { id },
                    }),
                });
            };
            this.InitializeStateFromAttributes_(); //Update state from attributes
            let pageId = (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.AddPage({
                path: ((pageData && typeof pageData.path === 'string') ? `${pageData.path}${this.state_.path}` : this.ResolvePath_()),
                name: (pageData ? `${pageData.name}${this.state_.name}` : this.state_.name),
                title: (this.state_.title || (pageData === null || pageData === void 0 ? void 0 : pageData.title) || ''),
                middleware: this.MergeParentMiddlewares_(pageData),
                onActive: (id) => {
                    executeExpression('onactive', id);
                    (pageData === null || pageData === void 0 ? void 0 : pageData.onActive) && pageData.onActive(id);
                },
                onInactive: (id) => {
                    executeExpression('oninactive', id);
                    (pageData === null || pageData === void 0 ? void 0 : pageData.onInactive) && pageData.onInactive(id);
                },
                cache: (this.state_.cache || (pageData === null || pageData === void 0 ? void 0 : pageData.cache)),
                reload: (this.state_.reload || (pageData === null || pageData === void 0 ? void 0 : pageData.reload)),
            });
            if (pageId) {
                this.id_ = pageId;
                scope.AddUninitCallback(() => {
                    var _a, _b;
                    let pageData = (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.FindPage(pageId);
                    if (pageData) {
                        pageData.onActive = pageData.onInactive = undefined;
                    }
                    (_b = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _b === void 0 ? void 0 : _b.RemovePage(pageId);
                });
            }
        });
    }
    GetRouterPageData() {
        var _a;
        return (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.FindPage(this.id_);
    }
    AttributeChanged_(name) {
        var _a;
        super.AttributeChanged_(name);
        let page = (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.FindPage(this.id_);
        if (!page) {
            return;
        }
        if (name === 'path') {
            page.path = this.ResolvePath_();
        }
        else if (name === 'middleware') {
            this.middlewares_ = null;
            page.middleware = this.MergeParentMiddlewares_();
        }
        else if (name !== 'id' && name !== 'onActive' && name !== 'onInactive' && page.hasOwnProperty(name)) {
            page[name] = this.state_[name];
        }
    }
    ResolvePath_() {
        if (!this.state_.path || typeof this.state_.path !== 'string') {
            return '';
        }
        let object = (0, inlinejs_1.RetrieveStoredObject)({
            key: this.state_.path,
            componentId: this.componentId_,
            contextElement: this,
        });
        return ((object instanceof RegExp) ? object : (0, inlinejs_1.ToString)(object));
    }
    ResolveMiddlewares_() {
        if (!this.middlewares_) {
            let middleware = (0, inlinejs_1.RetrieveStoredObject)({
                key: this.state_.middleware,
                componentId: this.componentId_,
                contextElement: this,
            });
            this.middlewares_ = (Array.isArray(middleware) ? middleware.map(m => (0, inlinejs_1.ToString)(m).trim()) : (0, inlinejs_1.ToString)(middleware).split(',').map(m => m.trim()));
        }
        return this.middlewares_;
    }
    GetParentPageData_() {
        return ((this.parentElement &&
            'GetRouterPageData' in this.parentElement &&
            typeof this.parentElement['GetRouterPageData'] === 'function' &&
            this.parentElement['GetRouterPageData']()) || null);
    }
    MergeParentMiddlewares_(pageData) {
        pageData = (pageData || this.GetParentPageData_());
        return (pageData ? [...((typeof pageData.middleware === 'string') ? [pageData.middleware] : (pageData.middleware || [])), ...this.ResolveMiddlewares_()] : this.ResolveMiddlewares_());
    }
}
exports.RouterPageElement = RouterPageElement;
function RouterPageElementCompact() {
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('router-page'), RouterPageElement);
}
exports.RouterPageElementCompact = RouterPageElementCompact;
