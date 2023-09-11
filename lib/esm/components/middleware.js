var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property } from "@benbraide/inlinejs-element";
import { RouterPathElement } from "./path";
export class RouterMiddlewareElement extends RouterPathElement {
    constructor() {
        super();
        this.middlewares = new Array();
    }
    MergeParentMiddlewares_(value) {
        let parentMiddlewares = (value || []);
        parentMiddlewares = (Array.isArray(parentMiddlewares) ? parentMiddlewares : [parentMiddlewares]);
        return [...parentMiddlewares, ...this.middlewares];
    }
}
__decorate([
    Property({ type: 'array', checkStoredObject: true })
], RouterMiddlewareElement.prototype, "middlewares", void 0);
