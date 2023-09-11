import { BootstrapAndAttach, EvaluateLater, GetGlobal, IElementScopeCreatedCallbackParams, ISplitPath, InsertHtml, JournalError, RetrieveStoredObject, SplitPath, TidyPath, ToString } from "@benbraide/inlinejs";
import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { IRouterConcept, IRouterDataHandlerParams, IRouterProtocolHandlerParams } from "../types";
import { RouterConceptName } from "../names";
import { RouterElement } from "./base";

export class RouterMount extends RouterElement{
    protected onload_ = '';
    protected scroll_ = false;

    @Property({ type: 'string', checkStoredObject: true })
    public protocol: string | RegExp = '';

    @Property({ type: 'string', checkStoredObject: true })
    public target: string | HTMLElement = '';

    @Property({ type: 'string' })
    public format = '$path';

    @Property({ type: 'string' })
    public onentered = '';

    @Property({ type: 'string' })
    public UpdateOnloadProperty(value: string){
        this.onload_ = value;
    }

    @Property({ type: 'string' })
    public onreload = '';

    @Property({ type: 'boolean' })
    public UpdateScrollProperty(value: boolean){
        this.scroll_ = value;
    }

    @Property({ type: 'boolean' })
    public reload = false;

    public constructor(){
        super();
    }

    public OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams){
        this.HandleElementScopeCreated_({ componentId, scope, ...rest }, () => {
            let concept = GetGlobal().GetConcept<IRouterConcept>(RouterConceptName);
            if (!concept){
                return JournalError(`${RouterConceptName} concept is not installed.`, GetGlobal().GetConfig().GetElementName('router-mount'), this);
            }

            let target = this.ResolveTarget_();
            if (!target){
                return JournalError('Mount target is invalid.', GetGlobal().GetConfig().GetElementName('router-mount'), this);
            }

            let attributes: Record<string, string> = {};
            Array.from(this.attributes).filter(attr => !(attr.name in this)).forEach(attr => (attributes[attr.name] = attr.value));
            Object.keys(attributes).forEach(key => this.removeAttribute(key));

            let onUninit: (() => void) | null = null;
            if (this.parentElement && !target.parentElement){//Add to DOM
                this.parentElement.insertBefore(target, this);
                onUninit = () => target?.remove();
            }

            let callLifecycleHook = (expression: string) => {
                EvaluateLater({
                    componentId,
                    contextElement: this,
                    expression,
                    disableFunctionCall: false,
                })();
            };
            
            let savedPath: string | null = null, handleData = ({ data, url }: IRouterDataHandlerParams) => {
                const oldPath = savedPath;
                (this.scroll_ || url !== savedPath) && window.scrollTo({ top: 0, left: 0 });
                
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
                        (url === oldPath) && callLifecycleHook(this.onreload);
                        callLifecycleHook(this.onload_);
                    },
                    afterTransitionCallback: () => {},
                    transitionScope: this,
                });
            };

            if (this.protocol){
                let checkpoint = 0;
                let protocolHandler = ({ path }: IRouterProtocolHandlerParams) => {
                    callLifecycleHook('entered');
        
                    if (path === savedPath && !this.reload){//Skip
                        callLifecycleHook(this.onreload);
                        return true;
                    }
        
                    let nestedCheckpoint = ++checkpoint, dataHandler = (data: string, splitPath: ISplitPath) => {
                        ((nestedCheckpoint == checkpoint) && handleData({ data, path: splitPath, url: path }));
                    };
                    
                    return { dataHandler, path: this.ResolvePath_(path), shouldReload: this.reload };
                };

                concept.AddProtocolHandler(this.protocol, protocolHandler);
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

    protected ResolveTarget_(){
        let resolvedTarget: HTMLElement | null = null;
        if (typeof this.target === 'string' && this.target.startsWith('new:')){
            const target = this.target.substring(4);
            resolvedTarget = (['main', 'div', 'section', 'p', 'figure', 'span'].includes(target) ? document.createElement(target) : null);
        }
        else if (typeof this.target === 'string'){
            resolvedTarget = document.querySelector(this.target);
        }
        else if (this.target instanceof HTMLElement){
            resolvedTarget = this.target;
        }

        return resolvedTarget;
    }

    protected ResolvePath_(path: string){
        const splitPath = SplitPath(path), context = {
            path: this.TryRelativePath_(TidyPath(path)),
            base: this.TryRelativePath_(splitPath.base),
            query: splitPath.query,
        };

        return ToString(EvaluateLater({ componentId: this.componentId_, contextElement: this, expression: this.format })(undefined, [], context));
    }

    protected TryRelativePath_(path: string){
        if (path.startsWith('http://') || path.startsWith('https://')){
            return path;
        }

        return (path.startsWith('/') ? path : `/${path}`);
    }
}

export function RouterMountElementCompact(){
    RegisterCustomElement(RouterMount);
}
