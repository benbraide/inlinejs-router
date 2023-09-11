"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterElementCompact = exports.Router = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const names_1 = require("../names");
const base_1 = require("./base");
class Router extends base_1.RouterElement {
    constructor() {
        super();
        this.mount = false;
        this.load = false;
    }
    UpdatePrefixProperty(value) {
        var _a;
        (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.SetPrefix(value);
    }
    OnElementScopeCreated(params) {
        this.HandleElementScopeCreated_(params, () => {
            const concept = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName);
            if (concept) {
                this.mount && concept.Mount(this.load);
            }
            else {
                (0, inlinejs_1.JournalError)(`${names_1.RouterConceptName} concept is not installed.`, (0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('router'), this);
            }
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], Router.prototype, "UpdatePrefixProperty", null);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], Router.prototype, "mount", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], Router.prototype, "load", void 0);
exports.Router = Router;
function RouterElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(Router);
}
exports.RouterElementCompact = RouterElementCompact;
