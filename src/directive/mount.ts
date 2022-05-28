import {
    BootstrapAndAttach,
    FindComponentById,
    InsertHtml,
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    GetGlobal,
    JournalError,
    ResolveOptions,
    ForwardEvent,
    ISplitPath,
    IsObject,
    TidyPath
} from "@benbraide/inlinejs";

import { RouterConceptName } from "../names";
import { IRouterConcept, IRouterDataHandlerParams, IRouterProtocolHandlerParams } from "../types";

interface IRouterMountOptions{
    protocol?: string;
    target?: HTMLElement;
}

export const MountRouterDirectiveExtension = CreateDirectiveHandlerCallback('mount', ({ componentId, contextElement, expression, argKey, argOptions }) => {
    if (!(contextElement instanceof HTMLTemplateElement)){
        return JournalError('Target is not a template element.', `${RouterConceptName}:${argKey}`, contextElement);
    }
    
    let concept = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName);
    if (!concept){
        return JournalError(`${RouterConceptName} concept is not installed.`, `${RouterConceptName}:${argKey}`, contextElement);
    }

    if (!contextElement.parentElement){
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

    let bind = (protocol: any) => {
        if (protocol && typeof protocol !== 'string' && !(protocol instanceof RegExp) && !(protocol instanceof HTMLElement) && !IsObject(protocol)){
            return JournalError('Target protocol is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
        }

        let mountElement: HTMLElement | null = null;
        if (protocol instanceof HTMLElement){//Mount target specified
            mountElement = protocol;
            protocol = null;
        }
        else if (IsObject(protocol)){
            mountElement = ((protocol as IRouterMountOptions).target || null);
            protocol = ((protocol as IRouterMountOptions).protocol || null);
        }
        
        if (!mountElement){//Create mount
            mountElement = document.createElement(options.main ? 'main' : (options.section ? 'section' : 'div'));
        }
        
        if (!mountElement){
            return JournalError('Mount target is invalid.', `${RouterConceptName}:${argKey}`, contextElement);
        }

        let onUninit: (() => void) | null = null;
        if (contextElement.parentElement && !mountElement.parentElement){//Add to DOM
            contextElement.parentElement.insertBefore(mountElement, contextElement);
            onUninit = () => mountElement!.remove();
        }

        let savedPath: string | null = null, handleData = ({ data, url }: IRouterDataHandlerParams) => {
            let oldPath = savedPath;
            if ((options.scroll || url !== savedPath) && !protocol){
                window.scrollTo({ top: 0, left: 0 });
            }
            
            savedPath = url;
            Array.from(mountElement!.attributes).forEach(attr => mountElement!.removeAttribute(attr.name));

            InsertHtml({
                element: mountElement!,
                html: data,
                component: componentId,
                processDirectives: false,
                afterInsert: () => {
                    BootstrapAndAttach(mountElement!);
                    (url === oldPath) && contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.reload`));
                    contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.load`));
                },
                afterTransitionCallback: () => {},
                transitionScope: contextElement,
            });
        };

        let checkpoint = 0, prepend = (path: string) => ('/' + TidyPath(`${protocol}${options.plural ? 's' : ''}/${path.startsWith('/') ? path.substring(1) : path}`));
        let protocolHandler = ({ path }: IRouterProtocolHandlerParams) => {
            contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.entered`));

            let fullPath = (options.prepend ? prepend(path) : path);
            if (fullPath === savedPath && !options.reload){//Skip
                contextElement.dispatchEvent(new CustomEvent(`${RouterConceptName}.mount.reload`));
                return true;
            }

            savedPath = fullPath;
            let myCheckpoint = ++checkpoint, dataHandler = (data: string, splitPath: ISplitPath) => ((myCheckpoint == checkpoint) && handleData({ data, path: splitPath, url: path }));
            
            return (options.prepend ? { dataHandler, path: fullPath, shouldReload: options.reload } : dataHandler);
        };

        if (protocol){
            concept!.AddProtocolHandler(protocol, protocolHandler);
        }
        else{
            concept!.AddDataHandler(handleData);
        }

        FindComponentById(componentId)?.FindElementScope(contextElement)?.AddUninitCallback(() => {
            if (protocol){
                GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemoveProtocolHandler(protocolHandler);
            }
            else{
                GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemoveDataHandler(handleData);
            }

            onUninit && onUninit();
        });
    };

    if (options.evaluate){
        EvaluateLater({ componentId, contextElement, expression })(bind);
    }
    else{
        bind(expression);
    }
});

function CreateMountEventExtension(name: string){
    return CreateDirectiveHandlerCallback(`mount-${name}`, ({ componentId, contextElement, expression, argKey, argOptions }) => {
        ForwardEvent(componentId, contextElement, `${RouterConceptName}-${argKey}.join`, expression, argOptions);
    });
}

export const MountLoadRouterDirectiveExtension = CreateMountEventExtension('load');
export const MountReloadRouterDirectiveExtension = CreateMountEventExtension('reload');
export const MountEnteredRouterDirectiveExtension = CreateMountEventExtension('entered');

export function MountRouterDirectiveExtensionCompact(){
    AddDirectiveHandler(MountRouterDirectiveExtension, RouterConceptName);
    AddDirectiveHandler(MountLoadRouterDirectiveExtension, RouterConceptName);
    AddDirectiveHandler(MountReloadRouterDirectiveExtension, RouterConceptName);
    AddDirectiveHandler(MountEnteredRouterDirectiveExtension, RouterConceptName);
}
