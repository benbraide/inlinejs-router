import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { IRouterFetcher } from "../types";
import { RouterPathElement } from "./path";
export declare class RouterFetch extends RouterPathElement {
    protected fetcher_: IRouterFetcher | null;
    constructor();
    OnElementScopeCreated({ scope, ...rest }: IElementScopeCreatedCallbackParams): void;
    protected PostPathUpdate_(shouldUpdate?: boolean): void;
    protected UpdateFetcher_(): void;
}
export declare function RouterFetchElementCompact(): void;
