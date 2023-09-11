export function GetParentPageData(element) {
    return ((element.parentElement &&
        'GetRouterPageData' in element.parentElement &&
        typeof element.parentElement['GetRouterPageData'] === 'function' &&
        element.parentElement['GetRouterPageData']()) || null);
}
