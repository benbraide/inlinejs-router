"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterGroupElementCompact = exports.RouterGroup = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const base_page_1 = require("./base-page");
class RouterGroup extends base_page_1.RouterBasePageElement {
    constructor() {
        super();
        this.options_.isTemplate = false;
        this.options_.isHidden = true;
    }
}
exports.RouterGroup = RouterGroup;
function RouterGroupElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(RouterGroup);
}
exports.RouterGroupElementCompact = RouterGroupElementCompact;
