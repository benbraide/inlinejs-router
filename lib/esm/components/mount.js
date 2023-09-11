var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { BootstrapAndAttach, EvaluateLater, GetGlobal, InsertHtml, JournalError, SplitPath, TidyPath, ToString } from "@benbraide/inlinejs";
import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { RouterConceptName } from "../names";
import { RouterElement } from "./base";
export class RouterMount extends RouterElement {
    constructor() {
        super();
        this.onload_ = '';
        this.scroll_ = false;
        this.protocol = '';
        this.target = '';
        this.format = '$path';
        this.onentered = '';
        this.onreload = '';
        this.reload = false;
    }
    UpdateOnloadProperty(value) {
        this.onload_ = value;
    }
    UpdateScrollProperty(value) {
        this.scroll_ = value;
    }
    OnElementScopeCreated(_a) {
        var { componentId, scope } = _a, rest = __rest(_a, ["componentId", "scope"]);
        this.HandleElementScopeCreated_(Object.assign({ componentId, scope }, rest), () => {
            let concept = GetGlobal().GetConcept(RouterConceptName);
            if (!concept) {
                return JournalError(`${RouterConceptName} concept is not installed.`, GetGlobal().GetConfig().GetElementName('router-mount'), this);
            }
            let target = this.ResolveTarget_();
            if (!target) {
                return JournalError('Mount target is invalid.', GetGlobal().GetConfig().GetElementName('router-mount'), this);
            }
            let attributes = {};
            Array.from(this.attributes).filter(attr => !(attr.name in this)).forEach(attr => (attributes[attr.name] = attr.value));
            Object.keys(attributes).forEach(key => this.removeAttribute(key));
            let onUninit = null;
            if (this.parentElement && !target.parentElement) { //Add to DOM
                this.parentElement.insertBefore(target, this);
                onUninit = () => target === null || target === void 0 ? void 0 : target.remove();
            }
            let callLifecycleHook = (expression) => {
                EvaluateLater({
                    componentId,
                    contextElement: this,
                    expression,
                    disableFunctionCall: false,
                })();
            };
            let savedPath = null, handleData = ({ data, url }) => {
                const oldPath = savedPath;
                (this.scroll_ || url !== savedPath) && window.scrollTo({ top: 0, left: 0 });
                savedPath = url;
                InsertHtml({
                    element: target,
                    html: data,
                    component: componentId,
                    processDirectives: false,
                    afterRemove: () => Array.from(target.attributes).forEach(attr => target.removeAttribute(attr.name)),
                    afterInsert: () => {
                        Object.entries(attributes).forEach(([key, value]) => target.setAttribute(key, value));
                        BootstrapAndAttach(target);
                        (url === oldPath) && callLifecycleHook(this.onreload);
                        callLifecycleHook(this.onload_);
                    },
                    afterTransitionCallback: () => { },
                    transitionScope: this,
                });
            };
            if (this.protocol) {
                let checkpoint = 0;
                let protocolHandler = ({ path }) => {
                    callLifecycleHook('entered');
                    if (path === savedPath && !this.reload) { //Skip
                        callLifecycleHook(this.onreload);
                        return true;
                    }
                    let nestedCheckpoint = ++checkpoint, dataHandler = (data, splitPath) => {
                        ((nestedCheckpoint == checkpoint) && handleData({ data, path: splitPath, url: path }));
                    };
                    return { dataHandler, path: this.ResolvePath_(path), shouldReload: this.reload };
                };
                concept.AddProtocolHandler(this.protocol, protocolHandler);
                scope.AddUninitCallback(() => {
                    var _a;
                    (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemoveProtocolHandler(protocolHandler);
                    onUninit && onUninit();
                });
            }
            else {
                concept.AddDataHandler(handleData);
                scope.AddUninitCallback(() => {
                    var _a;
                    (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemoveDataHandler(handleData);
                    onUninit && onUninit();
                });
            }
        });
    }
    ResolveTarget_() {
        let resolvedTarget = null;
        if (typeof this.target === 'string' && this.target.startsWith('new:')) {
            const target = this.target.substring(4);
            resolvedTarget = (['main', 'div', 'section', 'p', 'figure', 'span'].includes(target) ? document.createElement(target) : null);
        }
        else if (typeof this.target === 'string') {
            resolvedTarget = document.querySelector(this.target);
        }
        else if (this.target instanceof HTMLElement) {
            resolvedTarget = this.target;
        }
        return resolvedTarget;
    }
    ResolvePath_(path) {
        const splitPath = SplitPath(path), context = {
            path: this.TryRelativePath_(TidyPath(path)),
            base: this.TryRelativePath_(splitPath.base),
            query: splitPath.query,
        };
        return ToString(EvaluateLater({ componentId: this.componentId_, contextElement: this, expression: this.format })(undefined, [], context));
    }
    TryRelativePath_(path) {
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        return (path.startsWith('/') ? path : `/${path}`);
    }
}
__decorate([
    Property({ type: 'string', checkStoredObject: true })
], RouterMount.prototype, "protocol", void 0);
__decorate([
    Property({ type: 'string', checkStoredObject: true })
], RouterMount.prototype, "target", void 0);
__decorate([
    Property({ type: 'string' })
], RouterMount.prototype, "format", void 0);
__decorate([
    Property({ type: 'string' })
], RouterMount.prototype, "onentered", void 0);
__decorate([
    Property({ type: 'string' })
], RouterMount.prototype, "UpdateOnloadProperty", null);
__decorate([
    Property({ type: 'string' })
], RouterMount.prototype, "onreload", void 0);
__decorate([
    Property({ type: 'boolean' })
], RouterMount.prototype, "UpdateScrollProperty", null);
__decorate([
    Property({ type: 'boolean' })
], RouterMount.prototype, "reload", void 0);
export function RouterMountElementCompact() {
    RegisterCustomElement(RouterMount);
}
