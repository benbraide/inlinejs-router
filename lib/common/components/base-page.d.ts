import { RouterMiddlewareElement } from "./middleware";
import { IRouterPage } from "../types";
export declare class RouterBasePageElement extends RouterMiddlewareElement {
    nameValue: string;
    titleValue: string;
    cache: boolean;
    reload: boolean;
    onactive: string;
    oninactive: string;
    GetRouterPageData(): IRouterPage;
    protected GetId_(): string;
}
