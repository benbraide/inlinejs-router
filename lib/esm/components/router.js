var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { GetGlobal, JournalError } from "@benbraide/inlinejs";
import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { RouterConceptName } from "../names";
import { RouterElement } from "./base";
export class Router extends RouterElement {
    constructor() {
        super();
        this.mount = false;
        this.load = false;
    }
    UpdatePrefixProperty(value) {
        var _a;
        (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.SetPrefix(value);
    }
    OnElementScopeCreated(params) {
        this.HandleElementScopeCreated_(params, () => {
            const concept = GetGlobal().GetConcept(RouterConceptName);
            if (concept) {
                this.mount && concept.Mount(this.load);
            }
            else {
                JournalError(`${RouterConceptName} concept is not installed.`, GetGlobal().GetConfig().GetElementName('router'), this);
            }
        });
    }
}
__decorate([
    Property({ type: 'string' })
], Router.prototype, "UpdatePrefixProperty", null);
__decorate([
    Property({ type: 'boolean' })
], Router.prototype, "mount", void 0);
__decorate([
    Property({ type: 'boolean' })
], Router.prototype, "load", void 0);
export function RouterElementCompact() {
    RegisterCustomElement(Router);
}
