"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParentPageData = void 0;
function GetParentPageData(element) {
    return ((element.parentElement &&
        'GetRouterPageData' in element.parentElement &&
        typeof element.parentElement['GetRouterPageData'] === 'function' &&
        element.parentElement['GetRouterPageData']()) || null);
}
exports.GetParentPageData = GetParentPageData;
