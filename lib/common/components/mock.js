"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterMockElementCompact = exports.RouterMock = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const path_1 = require("./path");
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
class RouterMock extends path_1.RouterPathElement {
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
            let pathPrefix = (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.GetPrefix();
            if (pathPrefix) {
                path = (path.startsWith('/') ? `${pathPrefix}${path}` : `${pathPrefix}/${path}`);
            }
            const fetchHandler = () => {
                var _a;
                const response = (_a = (0, inlinejs_1.GetGlobal)().GetConcept('extended_fetch')) === null || _a === void 0 ? void 0 : _a.MockResponse({
                    response: this.innerHTML,
                    delay: this.delay,
                });
                return (response || Promise.resolve(new Response));
            };
            (_b = (0, inlinejs_1.GetGlobal)().GetConcept('extended_fetch')) === null || _b === void 0 ? void 0 : _b.AddPathHandler(path, fetchHandler);
            scope.AddUninitCallback(() => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept('extended_fetch')) === null || _a === void 0 ? void 0 : _a.RemovePathHandler(fetchHandler); });
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'number' })
], RouterMock.prototype, "delay", void 0);
exports.RouterMock = RouterMock;
function RouterMockElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(RouterMock);
}
exports.RouterMockElementCompact = RouterMockElementCompact;
