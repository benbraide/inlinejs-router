import { GetGlobal, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy, ISplitPath } from "@benbraide/inlinejs";

import { IRouterConcept, IRouterFetcher, IRouterMiddleware, IRouterPageName, IRouterPageOptions, RouterProtocolHandlerType } from "../types";
import { RouterConceptName } from "../names";

function CreateRouterProxy(){
    const getConcept = () => GetGlobal().GetConcept<IRouterConcept>(RouterConceptName);
    let methods = {
        setPrefix: (prefix: string) => getConcept()?.SetPrefix(prefix),
        addMiddleware: (middleware: IRouterMiddleware) => getConcept()?.AddMiddleware(middleware),
        removeMiddleware: (middleware: IRouterMiddleware | string) => getConcept()?.RemoveMiddleware(middleware),
        addFetcher: (fetcher: IRouterFetcher) => getConcept()?.AddFetcher(fetcher),
        removeFetcher: (fetcher: IRouterFetcher) => getConcept()?.RemoveFetcher(fetcher),
        addProtocolHandler: (protocol: string | RegExp, handler: RouterProtocolHandlerType) => getConcept()?.AddProtocolHandler(protocol, handler),
        removeProtocolHandler: (handler: RouterProtocolHandlerType) => getConcept()?.RemoveProtocolHandler(handler),
        addPage: (page: IRouterPageOptions) => getConcept()?.AddPage(page),
        removePage: (page: string | IRouterPageName) => getConcept()?.RemovePage(page),
        findPage: (page: string | IRouterPageName) => getConcept()?.FindPage(page),
        findMatchingPage: (path: string) => getConcept()?.FindMatchingPage(path),
        mount: (load?: boolean) => getConcept()?.Mount(load),
        goto: (path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any) => getConcept()?.Goto(path, shouldReload, data),
        reload: () => getConcept()?.Reload(),
        getCurrentPath: () => getConcept()?.GetCurrentPath(),
        getActivePage: () => getConcept()?.GetActivePage(),
        getActivePageData: (key?: string) => getConcept()?.GetActivePageData(key),
    };

    return CreateReadonlyProxy(methods);
}

const RouterProxy = CreateRouterProxy();

export const RouterMagicHandler = CreateMagicHandlerCallback(RouterConceptName, () => RouterProxy);

export function RouterMagicHandlerCompact(){
    AddMagicHandler(RouterMagicHandler);
}
