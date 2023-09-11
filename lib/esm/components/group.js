import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { RouterBasePageElement } from "./base-page";
export class RouterGroup extends RouterBasePageElement {
    constructor() {
        super();
        this.options_.isTemplate = false;
        this.options_.isHidden = true;
    }
}
export function RouterGroupElementCompact() {
    RegisterCustomElement(RouterGroup);
}
