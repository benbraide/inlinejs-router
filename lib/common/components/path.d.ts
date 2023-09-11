import { RouterElement } from "./base";
import { ISplitPath } from "@benbraide/inlinejs";
import { IRouterPage } from "../types";
export declare class RouterPathElement extends RouterElement {
    protected path_: string | RegExp | null;
    UpdatePathProperty(value: string | RegExp | ISplitPath): void;
    constructor();
    GetRouterPageData(): IRouterPage | null;
    protected PostPathUpdate_(shouldUpdate?: boolean): void;
    protected GetParentPageData_(): IRouterPage | null;
    protected ComputePath_(parentPageData?: IRouterPage | null): string | RegExp | null;
    protected ShouldPrependParentPath_(): boolean;
}
