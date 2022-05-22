import { IRouterFetcherOptimized, IRouterFetcherPlaceholder } from "../types";
export declare function ProcessPathPlaceholders(path: string | RegExp): (string | IRouterFetcherPlaceholder)[] | null;
export declare function MatchPath(path: string, info: IRouterFetcherOptimized, params: Record<string, any>, pathParts?: Array<string>): boolean;
