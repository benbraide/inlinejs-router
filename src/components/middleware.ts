import { Property } from "@benbraide/inlinejs-element";
import { RouterPathElement } from "./path";

export class RouterMiddlewareElement extends RouterPathElement{
    @Property({ type: 'array', checkStoredObject: true })
    public middlewares = new Array<string>();

    public constructor(){
        super();
    }

    protected MergeParentMiddlewares_(value: string | Array<string> | null){
        let parentMiddlewares = (value || []);
        parentMiddlewares = (Array.isArray(parentMiddlewares) ? parentMiddlewares : [parentMiddlewares]);
        return [...parentMiddlewares, ...this.middlewares];
    }
}
