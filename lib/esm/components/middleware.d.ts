import { RouterPathElement } from "./path";
export declare class RouterMiddlewareElement extends RouterPathElement {
    middlewares: string[];
    constructor();
    protected MergeParentMiddlewares_(value: string | Array<string> | null): string[];
}
