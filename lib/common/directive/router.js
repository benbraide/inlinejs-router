"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterDirectiveHandlerCompact = exports.RouterDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
exports.RouterDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)(names_1.RouterConceptName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    (0, inlinejs_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: names_1.RouterConceptName,
        event: argKey,
        defaultEvent: names_1.DefaultRouterEvent,
        eventWhitelist: names_1.RouterEvents,
        options: [...argOptions, 'window'],
        optionBlacklist: ['document', 'outside'],
    });
});
function RouterDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.RouterDirectiveHandler);
}
exports.RouterDirectiveHandlerCompact = RouterDirectiveHandlerCompact;
