import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
export declare class RouterFetchElement extends CustomElement {
    private componentId_;
    private fetcher_;
    constructor();
    OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams): void;
    protected AttributeChanged_(name: string): void;
    private ResolvePath_;
    private GetParentPageData_;
    private InitFetcher_;
}
export declare function RouterFetchElementCompact(): void;
