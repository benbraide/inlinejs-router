import { IRouterFetcher, IRouterFetcherHandlerParams } from "./types";

export class RouterFetcher implements IRouterFetcher{
    public constructor(private path_: string | RegExp, private handler_: (params: IRouterFetcherHandlerParams) => Promise<string>){}
    
    public GetPath(){
        return this.path_;
    }

    public Handle(params: IRouterFetcherHandlerParams){
        return this.handler_(params);
    }
}
