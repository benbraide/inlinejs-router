import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IRouterPage } from "../types";
export declare class RouterPageElement extends CustomElement {
    private id_;
    private componentId_;
    private middlewares_;
    constructor();
    OnElementScopeCreated({ componentId, scope, ...rest }: IElementScopeCreatedCallbackParams): void;
    GetRouterPageData(): IRouterPage | null | undefined;
    protected AttributeChanged_(name: string): void;
    private ResolvePath_;
    private ResolveMiddlewares_;
    private GetParentPageData_;
    private MergeParentMiddlewares_;
}
export declare function RouterPageElementCompact(): void;
