"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSRouter = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("./names");
const concept_1 = require("./concept");
const router_1 = require("./directive/router");
const fetch_1 = require("./directive/fetch");
const mount_1 = require("./directive/mount");
const link_1 = require("./directive/link");
const page_1 = require("./directive/page");
const router_2 = require("./magic/router");
function InlineJSRouter() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, inlinejs_1.GetGlobal)().SetConcept(names_1.RouterConceptName, new concept_1.RouterConcept());
        (0, router_1.RouterDirectiveHandlerCompact)();
        (0, fetch_1.FetchRouterDirectiveExtensionCompact)();
        (0, mount_1.MountRouterDirectiveExtensionCompact)();
        (0, link_1.LinkRouterDirectiveExtensionCompact)();
        (0, page_1.PageRouterDirectiveExtensionCompact)();
        (0, router_2.RouterMagicHandlerCompact)();
    });
}
exports.InlineJSRouter = InlineJSRouter;
