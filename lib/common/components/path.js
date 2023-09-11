"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterPathElement = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const base_1 = require("./base");
const inlinejs_1 = require("@benbraide/inlinejs");
const parent_page_1 = require("../utilities/parent-page");
class RouterPathElement extends base_1.RouterElement {
    constructor() {
        super();
        this.path_ = null;
    }
    UpdatePathProperty(value) {
        const shouldUpdate = (this.path_ !== null);
        ((0, inlinejs_1.IsObject)(value) && value.hasOwnProperty('path')) ? (this.path_ = value.path) : (this.path_ = ((value instanceof RegExp) ? value : (0, inlinejs_1.ToString)(value)));
        this.PostPathUpdate_(shouldUpdate);
    }
    GetRouterPageData() {
        return null;
    }
    PostPathUpdate_(shouldUpdate) { }
    GetParentPageData_() {
        return (0, parent_page_1.GetParentPageData)(this);
    }
    ComputePath_(parentPageData = null) {
        if (typeof this.path_ !== 'string' || !this.ShouldPrependParentPath_()) {
            return this.path_;
        }
        parentPageData = (parentPageData || this.GetParentPageData_());
        if (parentPageData && typeof parentPageData.path === 'string') {
            return `${parentPageData.path || ''}${this.path_ || ''}`;
        }
        return this.path_;
    }
    ShouldPrependParentPath_() {
        return true;
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string', checkStoredObject: true })
], RouterPathElement.prototype, "UpdatePathProperty", null);
exports.RouterPathElement = RouterPathElement;
