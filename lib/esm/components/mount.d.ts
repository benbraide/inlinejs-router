import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { RouterElement } from "./base";
export declare class RouterMount extends RouterElement {
    protected onload_: string;
    protected scroll_: boolean;
    protocol: string | RegExp;
    target: string | HTMLElement;
    format: string;
    onentered: string;
    UpdateOnloadProperty(value: string): void;
    onreload: string;
    UpdateScrollProperty(value: boolean): void;
    reload: boolean;
    constructor();
    OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams): void;
    protected ResolveTarget_(): HTMLElement | null;
    protected ResolvePath_(path: string): string;
    protected TryRelativePath_(path: string): string;
}
export declare function RouterMountElementCompact(): void;
