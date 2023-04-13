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
import { EvaluateLater, GetGlobal, JournalError } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { RouterConceptName, RouterEvents } from "../names";
export class RouterElement extends CustomElement {
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
            let concept = GetGlobal().GetConcept(RouterConceptName);
            if (!concept) {
                return JournalError(`${RouterConceptName} concept is not installed.`, GetGlobal().GetConfig().GetElementName('router'), this);
            }
            this.InitializeStateFromAttributes_(); //Update state from attributes
            this.state_.prefix && concept.SetPrefix(this.state_.prefix);
            let handlers = {};
            RouterEvents.forEach((event) => {
                globalThis.addEventListener(`${RouterConceptName}.${event}`, (handlers[event] = (e) => {
                    if (this.state_[`on${event}`]) {
                        EvaluateLater({
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
        (name === 'prefix') && ((_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.SetPrefix(this.state_.prefix));
    }
}
export function RouterElementCompact() {
    customElements.define(GetGlobal().GetConfig().GetElementName('router'), RouterElement);
}
