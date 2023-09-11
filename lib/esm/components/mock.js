var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { RouterPathElement } from "./path";
import { GetGlobal } from "@benbraide/inlinejs";
import { RouterConceptName } from "../names";
export class RouterMock extends RouterPathElement {
    constructor() {
        super();
        this.delay = 0;
    }
    OnElementScopeCreated(_a) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        this.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a, _b;
            let path = this.ComputePath_();
            if (typeof path !== 'string' || !path) {
                return;
            }
            let pathPrefix = (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.GetPrefix();
            if (pathPrefix) {
                path = (path.startsWith('/') ? `${pathPrefix}${path}` : `${pathPrefix}/${path}`);
            }
            const fetchHandler = () => {
                var _a;
                const response = (_a = GetGlobal().GetConcept('extended_fetch')) === null || _a === void 0 ? void 0 : _a.MockResponse({
                    response: this.innerHTML,
                    delay: this.delay,
                });
                return (response || Promise.resolve(new Response));
            };
            (_b = GetGlobal().GetConcept('extended_fetch')) === null || _b === void 0 ? void 0 : _b.AddPathHandler(path, fetchHandler);
            scope.AddUninitCallback(() => { var _a; return (_a = GetGlobal().GetConcept('extended_fetch')) === null || _a === void 0 ? void 0 : _a.RemovePathHandler(fetchHandler); });
        });
    }
}
__decorate([
    Property({ type: 'number' })
], RouterMock.prototype, "delay", void 0);
export function RouterMockElementCompact() {
    RegisterCustomElement(RouterMock);
}
