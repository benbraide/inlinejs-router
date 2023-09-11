"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterBasePageElement = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const middleware_1 = require("./middleware");
class RouterBasePageElement extends middleware_1.RouterMiddlewareElement {
    constructor() {
        super(...arguments);
        this.nameValue = '';
        this.titleValue = '';
        this.cache = false;
        this.reload = false;
        this.onactive = '';
        this.oninactive = '';
    }
    GetRouterPageData() {
        const pageData = (this.ShouldPrependParentPath_() ? this.GetParentPageData_() : null);
        return {
            id: this.GetId_(),
            path: (this.ComputePath_(pageData) || ''),
            name: (pageData ? `${pageData.name || ''}${this.nameValue}` : this.nameValue),
            title: (this.titleValue || (pageData === null || pageData === void 0 ? void 0 : pageData.title) || ''),
            middleware: this.MergeParentMiddlewares_((pageData === null || pageData === void 0 ? void 0 : pageData.middleware) || null),
            cache: (this.cache || (this.cache !== false && (pageData === null || pageData === void 0 ? void 0 : pageData.cache)) || false),
            reload: (this.reload || (this.reload !== false && (pageData === null || pageData === void 0 ? void 0 : pageData.reload)) || false),
        };
    }
    GetId_() {
        return '';
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string', name: 'name' })
], RouterBasePageElement.prototype, "nameValue", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string', name: 'title' })
], RouterBasePageElement.prototype, "titleValue", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], RouterBasePageElement.prototype, "cache", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], RouterBasePageElement.prototype, "reload", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], RouterBasePageElement.prototype, "onactive", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], RouterBasePageElement.prototype, "oninactive", void 0);
exports.RouterBasePageElement = RouterBasePageElement;
