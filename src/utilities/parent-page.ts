import { IRouterPage } from "../types";

export function GetParentPageData(element: HTMLElement){
    return <IRouterPage | null>((
        element.parentElement &&
        'GetRouterPageData' in element.parentElement &&
        typeof element.parentElement['GetRouterPageData'] === 'function' &&
        (element.parentElement['GetRouterPageData'] as any)()
    ) || null);
}
