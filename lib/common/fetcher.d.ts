import { IRouterFetcher, IRouterFetcherHandlerParams } from "./types";
export declare class RouterFetcher implements IRouterFetcher {
    private path_;
    private handler_;
    constructor(path_: string | RegExp, handler_: (params: IRouterFetcherHandlerParams) => Promise<string>);
    GetPath(): string | RegExp;
    Handle(params: IRouterFetcherHandlerParams): Promise<string>;
}
