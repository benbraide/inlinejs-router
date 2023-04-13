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
exports.RouterFetchElementCompact = exports.RouterFetchElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const names_1 = require("../names");
const fetcher_1 = require("../fetcher");
class RouterFetchElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            path: '',
        });
        this.componentId_ = '';
        this.fetcher_ = null;
    }
    OnElementScopeCreated(_a) {
        var { componentId, scope } = _a, rest = __rest(_a, ["componentId", "scope"]);
        super.OnElementScopeCreated(Object.assign({ componentId, scope }, rest));
        this.componentId_ = componentId;
        scope.AddPostAttributesProcessCallback(() => this.InitFetcher_());
        scope.AddUninitCallback(() => {
            var _a;
            this.fetcher_ && ((_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemoveFetcher(this.fetcher_));
            this.fetcher_ = null;
        });
    }
    AttributeChanged_(name) {
        var _a;
        super.AttributeChanged_(name);
        if (name === 'path') {
            this.fetcher_ && ((_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemoveFetcher(this.fetcher_));
            this.InitFetcher_();
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
        if ((0, inlinejs_1.IsObject)(object) && object.hasOwnProperty('path')) {
            return object.path;
        }
        return ((object instanceof RegExp) ? object : (0, inlinejs_1.ToString)(object));
    }
    GetParentPageData_() {
        return ((this.parentElement &&
            this.parentElement.hasOwnProperty('GetRouterPageData') &&
            typeof this.parentElement['GetRouterPageData'] === 'function' &&
            this.parentElement['GetRouterPageData']()) || null);
    }
    InitFetcher_() {
        var _a;
        let pageData = this.GetParentPageData_();
        this.InitializeStateFromAttributes_(); //Update state from attributes
        this.fetcher_ = new fetcher_1.RouterFetcher((this.ResolvePath_() || (pageData === null || pageData === void 0 ? void 0 : pageData.path) || ''), ({ params }) => {
            let data;
            if (Object.keys(params).length != 0) { //Perform interpolation
                data = this.innerHTML.replace(/\{\:\s*(.+?)\s*\:\}/g, (match, capture) => {
                    return (0, inlinejs_1.ToString)((0, inlinejs_1.EvaluateLater)({ componentId: this.componentId_, contextElement: this, expression: capture })(undefined, [params], { params }));
                });
            }
            else {
                data = this.innerHTML;
            }
            return Promise.resolve(data);
        });
        (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.AddFetcher(this.fetcher_);
    }
}
exports.RouterFetchElement = RouterFetchElement;
function RouterFetchElementCompact() {
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('router-fetch'), RouterFetchElement);
}
exports.RouterFetchElementCompact = RouterFetchElementCompact;
