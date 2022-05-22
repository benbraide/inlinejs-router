import { GetGlobal, WaitForGlobal } from '@benbraide/inlinejs';

import { RouterConceptName } from './names';
import { RouterConcept } from './concept';

import { RouterDirectiveHandlerCompact } from './directive/router';
import { FetchRouterDirectiveExtensionCompact } from './directive/fetch';
import { MountRouterDirectiveExtensionCompact } from './directive/mount';
import { LinkRouterDirectiveExtensionCompact } from './directive/link';
import { PageRouterDirectiveExtensionCompact } from './directive/page';

import { RouterMagicHandlerCompact } from './magic/router';

WaitForGlobal().then(() => {
    GetGlobal().SetConcept(RouterConceptName, new RouterConcept());

    RouterDirectiveHandlerCompact();
    FetchRouterDirectiveExtensionCompact();
    MountRouterDirectiveExtensionCompact();
    LinkRouterDirectiveExtensionCompact();
    PageRouterDirectiveExtensionCompact();

    RouterMagicHandlerCompact();
});
