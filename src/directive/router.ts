import {
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    BindEvent
} from "@benbraide/inlinejs";

import { DefaultRouterEvent, RouterConceptName, RouterEvents } from "../names";

export const RouterDirectiveHandler = CreateDirectiveHandlerCallback(RouterConceptName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: RouterConceptName,
        event: argKey,
        defaultEvent: DefaultRouterEvent,
        eventWhitelist: RouterEvents,
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    });
});

export function RouterDirectiveHandlerCompact(){
    AddDirectiveHandler(RouterDirectiveHandler);
}
