import { BootstrapAndAttach, EvaluateLater, GetGlobal, IElementScopeCreatedCallbackParams, ISplitPath, InsertHtml, JournalError, RetrieveStoredObject, TidyPath } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IRouterConcept, IRouterDataHandlerParams, IRouterProtocolHandlerParams } from "../types";
import { RouterConceptName } from "../names";

export class RouterMountElement extends CustomElement{
    public constructor(){
        super({
            protocol: '',
            target: '',
            prepend: '',
            onentered: '',
            onload: '',
            onreload: '',
            scroll: false,
            reload: false,
        });
    }

    public OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams){
        super.OnElementScopeCreated({ componentId, scope, ...rest });

        scope.AddPostAttributesProcessCallback(() => {
            let concept = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName);
            if (!concept){
                return JournalError(`${RouterConceptName} concept is not installed.`, GetGlobal().GetConfig().GetElementName('router-mount'), this);
            }

            this.InitializeStateFromAttributes_();//Update state from attributes

            let protocol = (RetrieveStoredObject({
                componentId,
                key: this.state_.protocol,
                contextElement: this,
            }) || '');
            
            let resolveTarget = () => {
                let target = RetrieveStoredObject({
                    componentId,
                    key: this.state_.target,
                    contextElement: this,
                });
                
                let resolvedTarget: HTMLElement | null = null;
                if (typeof target === 'string' && target.startsWith('new:')){
                    target = target.substring(4);
                    resolvedTarget = (['main', 'div', 'section', 'p', 'figure', 'span'].includes(target) ? document.createElement(target) : null);
                }
                else if (typeof target === 'string'){
                    resolvedTarget = document.querySelector(target);
                }
                else if (target instanceof HTMLElement){
                    resolvedTarget = target;
                }

                return resolvedTarget;
            };

            let target = resolveTarget();
            if (!target){
                return JournalError('Mount target is invalid.', GetGlobal().GetConfig().GetElementName('router-mount'), this);
            }

            let attributes: Record<string, string> = {};
            Array.from(this.attributes).filter(attr => !this.state_.hasOwnProperty(attr.name)).forEach(attr => (attributes[attr.name] = attr.value));

            let onUninit: (() => void) | null = null;
            if (this.parentElement && !target.parentElement){//Add to DOM
                this.parentElement.insertBefore(target, this);
                onUninit = () => target?.remove();
            }

            let callLifecycleHook = (name: string) => {
                EvaluateLater({
                    componentId,
                    contextElement: this,
                    expression: (this.state_[`on${name}`] || ''),
                    disableFunctionCall: false,
                })();
            };
            
            let savedPath: string | null = null, handleData = ({ data, url }: IRouterDataHandlerParams) => {
                let oldPath = savedPath;
                if (this.state_.scroll || url !== savedPath){
                    window.scrollTo({ top: 0, left: 0 });
                }
                
                savedPath = url;
                InsertHtml({
                    element: target!,
                    html: data,
                    component: componentId,
                    processDirectives: false,
                    afterRemove: () => Array.from(target!.attributes).forEach(attr => target!.removeAttribute(attr.name)),
                    afterInsert: () => {
                        Object.entries(attributes).forEach(([key, value]) => target!.setAttribute(key, value));
                        BootstrapAndAttach(target!);
                        (url === oldPath) && callLifecycleHook('reload');
                        callLifecycleHook('load');
                    },
                    afterTransitionCallback: () => {},
                    transitionScope: this,
                });
            };

            if (protocol && typeof protocol === 'string' || protocol instanceof RegExp){
                let checkpoint = 0, prepend = (path: string) => ('/' + TidyPath(`${this.state_.prepend}/${path.startsWith('/') ? path.substring(1) : path}`));
                let protocolHandler = ({ path }: IRouterProtocolHandlerParams) => {
                    callLifecycleHook('entered');
        
                    if (path === savedPath && !this.state_.reload){//Skip
                        callLifecycleHook('reload');
                        return true;
                    }
        
                    let nestedCheckpoint = ++checkpoint, dataHandler = (data: string, splitPath: ISplitPath) => {
                        ((nestedCheckpoint == checkpoint) && handleData({ data, path: splitPath, url: path }));
                    };
                    
                    return (this.state_.prepend ? { dataHandler, path: prepend(path), shouldReload: this.state_.reload } : dataHandler);
                };

                concept.AddProtocolHandler(protocol, protocolHandler);
                scope.AddUninitCallback(() => {
                    GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemoveProtocolHandler(protocolHandler);
                    onUninit && onUninit();
                });
            }
            else{
                concept.AddDataHandler(handleData);
                scope.AddUninitCallback(() => {
                    GetGlobal().GetConcept<IRouterConcept>(RouterConceptName)?.RemoveDataHandler(handleData);
                    onUninit && onUninit();
                });
            }
        });
    }
}

export function RouterMountElementCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('router-mount'), RouterMountElement);
}
