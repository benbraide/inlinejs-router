import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class RouterElement extends CustomElement {
    constructor();
    OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams): void;
    protected AttributeChanged_(name: string): void;
}
export declare function RouterElementCompact(): void;
