import { Property } from "@benbraide/inlinejs-element";
import { RouterElement } from "./base";
import { ISplitPath, IsObject, ToString } from "@benbraide/inlinejs";
import { IRouterPage } from "../types";
import { GetParentPageData } from "../utilities/parent-page";

export class RouterPathElement extends RouterElement{
    protected path_: string | RegExp | null = null;

    @Property({ type: 'string', checkStoredObject: true })
    public UpdatePathProperty(value: string | RegExp | ISplitPath){
        const shouldUpdate = (this.path_ !== null);
        (IsObject(value) && value.hasOwnProperty('path')) ? (this.path_ = (value as any).path) : (this.path_ = ((value instanceof RegExp) ? value : ToString(value)));
        this.PostPathUpdate_(shouldUpdate);
    }

    public constructor(){
        super();
    }

    public GetRouterPageData(): IRouterPage | null{
        return null;
    }

    protected PostPathUpdate_(shouldUpdate?: boolean){}

    protected GetParentPageData_(){
        return GetParentPageData(this);
    }

    protected ComputePath_(parentPageData: IRouterPage | null = null){
        if (typeof this.path_ !== 'string' || !this.ShouldPrependParentPath_()){
            return this.path_;
        }

        parentPageData = (parentPageData || this.GetParentPageData_());
        if (parentPageData && typeof parentPageData.path === 'string'){
            return `${parentPageData.path || ''}${this.path_ || ''}`;
        }

        return this.path_;
    }

    protected ShouldPrependParentPath_(){
        return true;
    }
}
