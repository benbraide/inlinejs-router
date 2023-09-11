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
exports.RouterFetchElementCompact = exports.RouterFetch = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const names_1 = require("../names");
const fetcher_1 = require("../fetcher");
const path_1 = require("./path");
class RouterFetch extends path_1.RouterPathElement {
    constructor() {
        super();
        this.fetcher_ = null;
    }
    OnElementScopeCreated(_a) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => this.UpdateFetcher_());
        scope.AddUninitCallback(() => {
            var _a;
            this.fetcher_ && ((_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemoveFetcher(this.fetcher_));
            this.fetcher_ = null;
        });
    }
    PostPathUpdate_(shouldUpdate) {
        shouldUpdate && this.UpdateFetcher_();
    }
    UpdateFetcher_() {
        var _a;
        this.fetcher_ = new fetcher_1.RouterFetcher((this.ComputePath_() || ''), ({ params }) => {
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
exports.RouterFetch = RouterFetch;
function RouterFetchElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(RouterFetch);
}
exports.RouterFetchElementCompact = RouterFetchElementCompact;
