import { ISplitPath } from "@benbraide/inlinejs";
export interface IRouterPageName {
    name: string;
}
export interface IRouterPageOptions {
    path: string | RegExp;
    name?: string;
    title?: string;
    middleware?: string | Array<string>;
    cache?: boolean;
    reload?: boolean;
    onActive?: (id: string) => void;
    onInactive?: (id: string) => void;
}
export interface IRouterPage extends IRouterPageOptions {
    id: string;
}
export interface IRouterMiddleware {
    GetName(): string;
    Handle(path: string): Promise<boolean>;
}
export interface IRouterFetcherHandlerParams {
    path: string;
    params: Record<string, any>;
}
export interface IRouterFetcher {
    GetPath(): string | RegExp;
    Handle(params: IRouterFetcherHandlerParams): Promise<string>;
}
export interface IRouterFetcherPlaceholder {
    value: string;
    type?: 'integer' | 'number' | 'string' | 'boolean' | 'array';
    isOptional: boolean;
}
export interface IRouterFetcherOptimized {
    fetcher: IRouterFetcher;
    optimized?: Array<string | IRouterFetcherPlaceholder>;
}
export interface IRouterFetcherSearchResponse {
    fetcher: IRouterFetcher;
    params?: Record<string, any>;
}
export interface IRouterProtocolHandlerParams {
    protocol: string;
    path: string;
}
export declare type RouterProtocolDataHandlerType = (data: string, path: ISplitPath) => void;
export interface IRouterProtocolModifyResponse {
    dataHandler: RouterProtocolDataHandlerType;
    path: string;
    shouldReload?: boolean;
}
export declare type RouterProtocolHandlerResponseType = void | boolean | RouterProtocolDataHandlerType | IRouterProtocolModifyResponse;
export declare type ValidRouterProtocolHandlerResponseType = RouterProtocolDataHandlerType | IRouterProtocolModifyResponse;
export declare type RouterProtocolHandlerType = (params: IRouterProtocolHandlerParams) => RouterProtocolHandlerResponseType;
export interface IRouterDataHandlerParams {
    data: string;
    path: ISplitPath;
    url: string;
}
export declare type RouterDataHandlerType = (params: IRouterDataHandlerParams) => void;
export declare type RouterPathChangeHandlerType = (path: string) => void;
export interface IRouterConcept {
    GetOrigin(): string;
    SetPrefix(prefix: string): void;
    GetPrefix(): string;
    AddMiddleware(middleware: IRouterMiddleware): void;
    RemoveMiddleware(middleware: IRouterMiddleware | string): void;
    AddFetcher(fetcher: IRouterFetcher): void;
    RemoveFetcher(fetcher: IRouterFetcher): void;
    FindFetcher(path: string): IRouterFetcherSearchResponse | null;
    AddProtocolHandler(protocol: string | RegExp, handler: RouterProtocolHandlerType): void;
    RemoveProtocolHandler(handler: RouterProtocolHandlerType): void;
    AddDataHandler(handler: RouterDataHandlerType): void;
    RemoveDataHandler(handler: RouterDataHandlerType): void;
    AddPathChangeHandler(handler: RouterPathChangeHandlerType): void;
    RemovePathChangeHandler(handler: RouterPathChangeHandlerType): void;
    AddPage(options: IRouterPageOptions): string;
    RemovePage(page: string | IRouterPageName): void;
    FindPage(page: string | IRouterPageName): IRouterPage | null;
    FindMatchingPage(path: string): IRouterPage | null;
    Mount(load?: boolean): void;
    Goto(path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any): void;
    Reload(): void;
    GetCurrentPath(): string;
    GetCurrentQueryParams(): Record<string, Array<string> | string>;
    GetCurrentQueryParam(name: string): Array<string> | string | null;
    GetActivePage(): IRouterPage | null;
    GetActivePageData(key?: string): any;
}
