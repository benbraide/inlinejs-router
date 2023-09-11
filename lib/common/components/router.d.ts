import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { RouterElement } from "./base";
export declare class Router extends RouterElement {
    UpdatePrefixProperty(value: string): void;
    mount: boolean;
    load: boolean;
    constructor();
    OnElementScopeCreated(params: IElementScopeCreatedCallbackParams): void;
}
export declare function RouterElementCompact(): void;
