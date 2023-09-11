var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property } from "@benbraide/inlinejs-element";
import { RouterElement } from "./base";
import { IsObject, ToString } from "@benbraide/inlinejs";
import { GetParentPageData } from "../utilities/parent-page";
export class RouterPathElement extends RouterElement {
    constructor() {
        super();
        this.path_ = null;
    }
    UpdatePathProperty(value) {
        const shouldUpdate = (this.path_ !== null);
        (IsObject(value) && value.hasOwnProperty('path')) ? (this.path_ = value.path) : (this.path_ = ((value instanceof RegExp) ? value : ToString(value)));
        this.PostPathUpdate_(shouldUpdate);
    }
    GetRouterPageData() {
        return null;
    }
    PostPathUpdate_(shouldUpdate) { }
    GetParentPageData_() {
        return GetParentPageData(this);
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
    Property({ type: 'string', checkStoredObject: true })
], RouterPathElement.prototype, "UpdatePathProperty", null);
