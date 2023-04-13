"use strict";
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
exports.RouterElementCompact = exports.RouterElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const names_1 = require("../names");
class RouterElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            prefix: '',
            onload: '',
            onreload: '',
            onerror: '',
            on404: '',
            onentered: '',
            onpage: '',
            onpath: '',
            mount: false,
            load: false,
        });
    }
    OnElementScopeCreated(_a) {
        var { componentId, scope } = _a, rest = __rest(_a, ["componentId", "scope"]);
        super.OnElementScopeCreated(Object.assign({ componentId, scope }, rest));
        scope.AddPostAttributesProcessCallback(() => {
            let concept = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName);
            if (!concept) {
                return (0, inlinejs_1.JournalError)(`${names_1.RouterConceptName} concept is not installed.`, (0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('router'), this);
            }
            this.InitializeStateFromAttributes_(); //Update state from attributes
            this.state_.prefix && concept.SetPrefix(this.state_.prefix);
            let handlers = {};
            names_1.RouterEvents.forEach((event) => {
                globalThis.addEventListener(`${names_1.RouterConceptName}.${event}`, (handlers[event] = (e) => {
                    if (this.state_[`on${event}`]) {
                        (0, inlinejs_1.EvaluateLater)({
                            componentId,
                            contextElement: this,
                            expression: this.state_[`on${event}`],
                            disableFunctionCall: false,
                        })(undefined, undefined, { event: e });
                    }
                }));
            });
            this.state_.mount && concept.Mount(this.state_.load);
        });
    }
    AttributeChanged_(name) {
        var _a;
        super.AttributeChanged_(name);
        (name === 'prefix') && ((_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.SetPrefix(this.state_.prefix));
    }
}
exports.RouterElement = RouterElement;
function RouterElementCompact() {
    customElements.define((0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('router'), RouterElement);
}
exports.RouterElementCompact = RouterElementCompact;
