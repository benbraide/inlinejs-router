"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountRouterDirectiveExtensionCompact = exports.MountEnteredRouterDirectiveExtension = exports.MountReloadRouterDirectiveExtension = exports.MountLoadRouterDirectiveExtension = exports.MountRouterDirectiveExtension = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
exports.MountRouterDirectiveExtension = (0, inlinejs_1.CreateDirectiveHandlerCallback)('mount', ({ componentId, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)) {
        return (0, inlinejs_1.JournalError)('Target is not a template element.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
    }
    let concept = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName);
    if (!concept) {
        return (0, inlinejs_1.JournalError)(`${names_1.RouterConceptName} concept is not installed.`, `${names_1.RouterConceptName}:${argKey}`, contextElement);
    }
    if (!contextElement.parentElement) {
        return (0, inlinejs_1.JournalError)('Target must have a parent element.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
    }
    let options = (0, inlinejs_1.ResolveOptions)({
        options: {
            main: false,
            section: false,
            scroll: false,
            prepend: false,
            plural: false,
            reload: false,
            evaluate: false,
        },
        list: argOptions,
    });
    let bind = (protocol) => {
        var _a, _b;
        if (protocol && typeof protocol !== 'string' && !(protocol instanceof RegExp) && !(protocol instanceof HTMLElement) && !(0, inlinejs_1.IsObject)(protocol)) {
            return (0, inlinejs_1.JournalError)('Target protocol is invalid.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
        }
        let mountElement = null;
        if (protocol instanceof HTMLElement) { //Mount target specified
            mountElement = protocol;
            protocol = null;
        }
        else if ((0, inlinejs_1.IsObject)(protocol)) {
            mountElement = (protocol.target || null);
            protocol = (protocol.protocol || null);
        }
        if (!mountElement) { //Create mount
            mountElement = document.createElement(options.main ? 'main' : (options.section ? 'section' : 'div'));
        }
        if (!mountElement) {
            return (0, inlinejs_1.JournalError)('Mount target is invalid.', `${names_1.RouterConceptName}:${argKey}`, contextElement);
        }
        let onUninit = null;
        if (contextElement.parentElement && !mountElement.parentElement) { //Add to DOM
            contextElement.parentElement.insertBefore(mountElement, contextElement);
            onUninit = () => mountElement.remove();
        }
        let savedPath = null, handleData = ({ data, url }) => {
            let oldPath = savedPath;
            if ((options.scroll || url !== savedPath) && !protocol) {
                window.scrollTo({ top: 0, left: 0 });
            }
            savedPath = url;
            Array.from(mountElement.attributes).forEach(attr => mountElement.removeAttribute(attr.name));
            (0, inlinejs_1.InsertHtml)({
                element: mountElement,
                html: data,
                component: componentId,
                processDirectives: false,
                afterInsert: () => {
                    (0, inlinejs_1.BootstrapAndAttach)(mountElement);
                    (url === oldPath) && contextElement.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.mount.reload`));
                    contextElement.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.mount.load`));
                },
                afterTransitionCallback: () => { },
                transitionScope: contextElement,
            });
        };
        let checkpoint = 0;
        let protocolHandler = ({ path }) => {
            contextElement.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.mount.entered`));
            if (path === savedPath && !options.reload) { //Skip
                contextElement.dispatchEvent(new CustomEvent(`${names_1.RouterConceptName}.mount.reload`));
                return true;
            }
            let myCheckpoint = ++checkpoint, dataHandler = (data, splitPath) => ((myCheckpoint == checkpoint) && handleData({ data, path: splitPath, url: path }));
            if (options.prepend) { //Prepend protocol string
                path = `/${protocol}${options.plural ? 's' : ''}/${path.startsWith('/') ? path.substring(1) : path}`;
                return { dataHandler, path, shouldReload: options.reload };
            }
            return dataHandler;
        };
        if (protocol) {
            concept.AddProtocolHandler(protocol, protocolHandler);
        }
        else {
            concept.AddDataHandler(handleData);
        }
        (_b = (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => {
            var _a, _b;
            if (protocol) {
                (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemoveProtocolHandler(protocolHandler);
            }
            else {
                (_b = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.RouterConceptName)) === null || _b === void 0 ? void 0 : _b.RemoveDataHandler(handleData);
            }
            onUninit && onUninit();
        });
    };
    if (options.evaluate) {
        (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })(bind);
    }
    else {
        bind(expression);
    }
});
function CreateMountEventExtension(name) {
    return (0, inlinejs_1.CreateDirectiveHandlerCallback)(`mount-${name}`, ({ componentId, contextElement, expression, argKey, argOptions }) => {
        (0, inlinejs_1.ForwardEvent)(componentId, contextElement, `${names_1.RouterConceptName}-${argKey}.join`, expression, argOptions);
    });
}
exports.MountLoadRouterDirectiveExtension = CreateMountEventExtension('load');
exports.MountReloadRouterDirectiveExtension = CreateMountEventExtension('reload');
exports.MountEnteredRouterDirectiveExtension = CreateMountEventExtension('entered');
function MountRouterDirectiveExtensionCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.MountRouterDirectiveExtension, names_1.RouterConceptName);
    (0, inlinejs_1.AddDirectiveHandler)(exports.MountLoadRouterDirectiveExtension, names_1.RouterConceptName);
    (0, inlinejs_1.AddDirectiveHandler)(exports.MountReloadRouterDirectiveExtension, names_1.RouterConceptName);
    (0, inlinejs_1.AddDirectiveHandler)(exports.MountEnteredRouterDirectiveExtension, names_1.RouterConceptName);
}
exports.MountRouterDirectiveExtensionCompact = MountRouterDirectiveExtensionCompact;
