"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSRouter = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("./names");
const concept_1 = require("./concept");
const fetch_1 = require("./components/fetch");
const group_1 = require("./components/group");
const mount_1 = require("./components/mount");
const page_1 = require("./components/page");
const router_1 = require("./components/router");
const router_2 = require("./directive/router");
const fetch_2 = require("./directive/fetch");
const mount_2 = require("./directive/mount");
const link_1 = require("./directive/link");
const page_2 = require("./directive/page");
const router_3 = require("./magic/router");
function InlineJSRouter() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, inlinejs_1.GetGlobal)().SetConcept(names_1.RouterConceptName, new concept_1.RouterConcept());
        (0, fetch_1.RouterFetchElementCompact)();
        (0, group_1.RouterGroupElementCompact)();
        (0, mount_1.RouterMountElementCompact)();
        (0, page_1.RouterPageElementCompact)();
        (0, router_1.RouterElementCompact)();
        (0, router_2.RouterDirectiveHandlerCompact)();
        (0, fetch_2.FetchRouterDirectiveExtensionCompact)();
        (0, mount_2.MountRouterDirectiveExtensionCompact)();
        (0, link_1.LinkRouterDirectiveExtensionCompact)();
        (0, page_2.PageRouterDirectiveExtensionCompact)();
        (0, router_3.RouterMagicHandlerCompact)();
    });
}
exports.InlineJSRouter = InlineJSRouter;
