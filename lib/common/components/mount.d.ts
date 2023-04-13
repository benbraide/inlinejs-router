import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class RouterMountElement extends CustomElement {
    constructor();
    OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams): void;
}
export declare function RouterMountElementCompact(): void;
