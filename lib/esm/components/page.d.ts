import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { RouterBasePageElement } from "./base-page";
export declare class RouterPage extends RouterBasePageElement {
    protected id_: string;
    constructor();
    OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams): void;
    protected GetId_(): string;
}
export declare function RouterPageElementCompact(): void;
