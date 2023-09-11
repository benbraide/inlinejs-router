import { RouterPathElement } from "./path";
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
export declare class RouterMock extends RouterPathElement {
    delay: number;
    constructor();
    OnElementScopeCreated({ scope, ...rest }: IElementScopeCreatedCallbackParams): void;
}
export declare function RouterMockElementCompact(): void;
