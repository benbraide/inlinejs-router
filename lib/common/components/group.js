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
exports.RouterGroupElementCompact = exports.RouterGroupElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class RouterGroupElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            path: '',
            name: '',
            title: '',
            middleware: '',
            cache: false,
            reload: false,
        });
        this.componentId_ = '';
        this.pageInfo_ = null;
        this.middlewares_ = null;
    }
    OnElementScopeCreated(_a) {
        var { componentId, scope } = _a, rest = __rest(_a, ["componentId", "scope"]);
        super.OnElementScopeCreated(Object.assign({ componentId, scope }, rest));
        this.componentId_ = componentId;
        scope.AddPostAttributesProcessCallback(() => {
            let pageData = this.GetParentPageData_();
            this.InitializeStateFromAttributes_(); //Update state from attributes
            this.pageInfo_ = {
                path: ((pageData && typeof pageData.path === 'string') ? `${pageData.path}${this.state_.path}` : this.ResolvePath_()),
                name: (pageData ? `${pageData.name}${this.state_.name}` : this.state_.name),
                title: (this.state_.title || (pageData === null || pageData === void 0 ? void 0 : pageData.title) || ''),
                middleware: this.MergeParentMiddlewares_(pageData),
                cache: (this.state_.cache || (pageData === null || pageData === void 0 ? void 0 : pageData.cache)),
                reload: (this.state_.reload || (pageData === null || pageData === void 0 ? void 0 : pageData.reload)),
            };
        });
    }
    GetRouterPageData() {
        return this.pageInfo_;
    }
    AttributeChanged_(name) {
        super.AttributeChanged_(name);
        if (!this.pageInfo_) {
            return;
        }
        if (name === 'path') {
            this.pageInfo_.path = this.ResolvePath_();
        }
        else if (name === 'middleware') {
            this.middlewares_ = null;
            this.pageInfo_.middleware = this.MergeParentMiddlewares_();
        }
        else if (name !== 'id' && name !== 'onActive' && name !== 'onInactive' && this.pageInfo_.hasOwnProperty(name)) {
            this.pageInfo_[name] = this.state_[name];
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
            this.parentElement.hasOwnProperty('GetRouterPageData') &&
            typeof this.parentElement['GetRouterPageData'] === 'function' &&
            this.parentElement['GetRouterPageData']()) || null);
    }
    MergeParentMiddlewares_(pageData) {
        pageData = (pageData || this.GetParentPageData_());
        return (pageData ? [...((typeof pageData.middleware === 'string') ? [pageData.middleware] : (pageData.middleware || [])), ...this.ResolveMiddlewares_()] : this.ResolveMiddlewares_());
    }
}
exports.RouterGroupElement = RouterGroupElement;
function RouterGroupElementCompact() {
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('router-group'), RouterGroupElement);
}
exports.RouterGroupElementCompact = RouterGroupElementCompact;