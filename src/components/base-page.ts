import { Property } from "@benbraide/inlinejs-element";
import { RouterMiddlewareElement } from "./middleware";
import { IRouterPage } from "../types";

export class RouterBasePageElement extends RouterMiddlewareElement{
    @Property({ type: 'string', name: 'name' })
    public nameValue = '';

    @Property({ type: 'string', name: 'title' })
    public titleValue = '';

    @Property({ type: 'boolean' })
    public cache = false;

    @Property({ type: 'boolean' })
    public reload = false;

    @Property({ type: 'string'})
    public onactive = '';

    @Property({ type: 'string'})
    public oninactive = '';

    public GetRouterPageData(): IRouterPage{
        const pageData = (this.ShouldPrependParentPath_() ? this.GetParentPageData_() : null);
        return {
            id: this.GetId_(),
            path: (this.ComputePath_(pageData) || ''),
            name: (pageData ? `${pageData.name || ''}${this.nameValue}` : this.nameValue),
            title: (this.titleValue || pageData?.title || ''),
            middleware: this.MergeParentMiddlewares_(pageData?.middleware || null),
            cache: (this.cache || (this.cache !== false && pageData?.cache) || false),
            reload: (this.reload || (this.reload !== false && pageData?.reload) || false),
        };
    }

    protected GetId_(){
        return '';
    }
}
