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
import { GetGlobal, EvaluateLater } from "@benbraide/inlinejs";
import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { RouterConceptName } from "../names";
import { RouterBasePageElement } from "./base-page";
export class RouterPage extends RouterBasePageElement {
    constructor() {
        super();
        this.id_ = '';
    }
    OnElementScopeCreated(_a) {
        var { componentId, scope } = _a, rest = __rest(_a, ["componentId", "scope"]);
        this.HandleElementScopeCreated_(Object.assign({ componentId, scope }, rest), () => {
            var _a;
            const pageData = this.GetRouterPageData(), executeExpression = (exp, id) => {
                if (!exp) {
                    return;
                }
                const evaluate = EvaluateLater({
                    componentId,
                    contextElement: this,
                    expression: this[exp],
                    disableFunctionCall: false,
                });
                evaluate(undefined, undefined, {
                    event: new CustomEvent(`${RouterConceptName}.page.${exp.substring(2)}`, {
                        detail: { id },
                    }),
                });
            };
            const { onActive, onInactive } = pageData, pageId = (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.AddPage({
                path: pageData.path,
                name: pageData.name,
                title: pageData.title,
                middleware: pageData.middleware,
                onActive: (id) => {
                    executeExpression(this.onactive, id);
                    onActive && onActive(id);
                },
                onInactive: (id) => {
                    executeExpression(this.oninactive, id);
                    onInactive && onInactive(id);
                },
                cache: pageData.cache,
                reload: pageData.reload,
            });
            if (pageId) {
                this.id_ = pageId;
                scope.AddUninitCallback(() => {
                    var _a, _b;
                    let pageData = (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.FindPage(pageId);
                    pageData && (pageData.onActive = pageData.onInactive = undefined);
                    (_b = GetGlobal().GetConcept(RouterConceptName)) === null || _b === void 0 ? void 0 : _b.RemovePage(pageId);
                });
            }
        });
    }
    GetId_() {
        return this.id_;
    }
}
export function RouterPageElementCompact() {
    RegisterCustomElement(RouterPage);
}
