import { ISplitPath } from "@benbraide/inlinejs";
import { IRouterPageName, IRouterConcept, IRouterMiddleware, IRouterPage, IRouterPageOptions, IRouterFetcher, RouterProtocolHandlerType, IRouterFetcherSearchResponse, RouterDataHandlerType } from "./types";
export declare class RouterConcept implements IRouterConcept {
    private prefix_;
    private origin_;
    private markers_;
    private onEvent_;
    private checkpoint_;
    private active_;
    private middlewares_;
    private fetchers_;
    private protocolHandlers_;
    private dataHandlers_;
    private pages_;
    private current_;
    constructor(prefix_?: string, origin_?: string);
    SetPrefix(prefix: string): void;
    AddMiddleware(middleware: IRouterMiddleware): void;
    RemoveMiddleware(middleware: IRouterMiddleware | string): void;
    AddFetcher(fetcher: IRouterFetcher): void;
    FindFetcher(path: string): IRouterFetcherSearchResponse | null;
    RemoveFetcher(fetcher: IRouterFetcher): void;
    AddProtocolHandler(protocol: string | RegExp, handler: RouterProtocolHandlerType): void;
    RemoveProtocolHandler(handler: RouterProtocolHandlerType): void;
    AddDataHandler(handler: RouterDataHandlerType): void;
    RemoveDataHandler(handler: RouterDataHandlerType): void;
    AddPage({ path, ...rest }: IRouterPageOptions): string;
    RemovePage(page: string | IRouterPageName): {
        id: string;
        path: string | RegExp;
        name?: string | undefined;
        title?: string | undefined;
        middleware?: string | string[] | undefined;
        cache?: boolean | undefined;
        reload?: boolean | undefined;
    } | null;
    FindPage(page: string | IRouterPageName): IRouterPage | null;
    FindMatchingPage(path: string): IRouterPage | null;
    Mount(load?: boolean): void;
    Goto(path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any): void;
    Reload(): void;
    GetCurrentPath(): string;
    GetActivePage(): IRouterPage | null;
    GetActivePageData(key?: string): any;
    private FindProtocolHandler_;
    private Load_;
    private DoLoad_;
    private SetActiveState_;
}
