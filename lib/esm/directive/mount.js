import { BootstrapAndAttach, FindComponentById, InsertHtml, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, JournalError, ResolveOptions, ForwardEvent, IsObject, TidyPath } from "@benbraide/inlinejs";
import { RouterConceptName } from "../names";
export const MountRouterDirectiveExtension = CreateDirectiveHandlerCallback('mount', ({ componentId, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)) {
        return JournalError('Target is not a template element.', `${RouterConceptName}:${argKey}`, contextElement);
    }
    let concept = GetGlobal().GetConcept(RouterConceptName);
    if (!concept) {
        return JournalError(`${RouterConceptName} concept is not installed.`, `${RouterConceptName}:${argKey}`, contextElement);
    }
    if (!contextElement.parentElement) {
        return JournalError('Target must have a parent element.', `${RouterConceptName}:${argKey}`, contextElement);
    }
    let options = ResolveOptions({
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
        if (protocol && typeof protocol !== 'string' && !(protocol instanceof RegExp) && !(protocol instanceof HTMLElement) && !IsObject(protocol)) {
            return JournalError('Target protocol is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
        }
        let mountElement = null;
        if (protocol instanceof HTMLElement) { //Mount target specified
            mountElement = protocol;
            protocol = null;
        }
        else if (IsObject(protocol)) {
            mountElement = (protocol.target || null);
            protocol = (protocol.protocol || null);
        }
        if (!mountElement) { //Create mount
            mountElement = document.createElement(options.main ? 'main' : (options.section ? 'section' : 'div'));
        }
        if (!mountElement) {
            return JournalError('Mount target is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
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
            InsertHtml({
                element: mountElement,
                html: data,
                component: componentId,
                processDirectives: false,
                afterInsert: () => {
                    BootstrapAndAttach(mountElement);
                    (url === oldPath) && contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.reload`));
                    contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.load`));
                },
                afterTransitionCallback: () => { },
                transitionScope: contextElement,
            });
        };
        let checkpoint = 0, prepend = (path) => ('/' + TidyPath(`${protocol}${options.plural ? 's' : ''}/${path.startsWith('/') ? path.substring(1) : path}`));
        let protocolHandler = ({ path }) => {
            contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.entered`));
            if (path === savedPath && !options.reload) { //Skip
                contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.reload`));
                return true;
            }
            let myCheckpoint = ++checkpoint, dataHandler = (data, splitPath) => ((myCheckpoint == checkpoint) && handleData({ data, path: splitPath, url: path }));
            return (options.prepend ? { dataHandler, path: prepend(path), shouldReload: options.reload } : dataHandler);
        };
        if (protocol) {
            concept.AddProtocolHandler(protocol, protocolHandler);
        }
        else {
            concept.AddDataHandler(handleData);
        }
        (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => {
            var _a, _b;
            if (protocol) {
                (_a = GetGlobal().GetConcept(RouterConceptName)) === null || _a === void 0 ? void 0 : _a.RemoveProtocolHandler(protocolHandler);
            }
            else {
                (_b = GetGlobal().GetConcept(RouterConceptName)) === null || _b === void 0 ? void 0 : _b.RemoveDataHandler(handleData);
            }
            onUninit && onUninit();
        });
    };
    if (options.evaluate) {
        EvaluateLater({ componentId, contextElement, expression })(bind);
    }
    else {
        bind(expression);
    }
});
function CreateMountEventExtension(name) {
    return CreateDirectiveHandlerCallback(`mount-${name}`, ({ componentId, contextElement, expression, argKey, argOptions }) => {
        ForwardEvent(componentId, contextElement, `${RouterConceptName}-${argKey}.join`, expression, argOptions);
    });
}
export const MountLoadRouterDirectiveExtension = CreateMountEventExtension('load');
export const MountReloadRouterDirectiveExtension = CreateMountEventExtension('reload');
export const MountEnteredRouterDirectiveExtension = CreateMountEventExtension('entered');
export function MountRouterDirectiveExtensionCompact() {
    AddDirectiveHandler(MountRouterDirectiveExtension, RouterConceptName);
    AddDirectiveHandler(MountLoadRouterDirectiveExtension, RouterConceptName);
    AddDirectiveHandler(MountReloadRouterDirectiveExtension, RouterConceptName);
    AddDirectiveHandler(MountEnteredRouterDirectiveExtension, RouterConceptName);
}
