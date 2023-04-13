import { GetGlobal, WaitForGlobal } from '@benbraide/inlinejs';
import { RouterConceptName } from './names';
import { RouterConcept } from './concept';
import { RouterFetchElementCompact } from './components/fetch';
import { RouterGroupElementCompact } from './components/group';
import { RouterMountElementCompact } from './components/mount';
import { RouterPageElementCompact } from './components/page';
import { RouterElementCompact } from './components/router';
import { RouterDirectiveHandlerCompact } from './directive/router';
import { FetchRouterDirectiveExtensionCompact } from './directive/fetch';
import { MountRouterDirectiveExtensionCompact } from './directive/mount';
import { LinkRouterDirectiveExtensionCompact } from './directive/link';
import { PageRouterDirectiveExtensionCompact } from './directive/page';
import { RouterMagicHandlerCompact } from './magic/router';
export function InlineJSRouter() {
    WaitForGlobal().then(() => {
        GetGlobal().SetConcept(RouterConceptName, new RouterConcept());
        RouterFetchElementCompact();
        RouterGroupElementCompact();
        RouterMountElementCompact();
        RouterPageElementCompact();
        RouterElementCompact();
        RouterDirectiveHandlerCompact();
        FetchRouterDirectiveExtensionCompact();
        MountRouterDirectiveExtensionCompact();
        LinkRouterDirectiveExtensionCompact();
        PageRouterDirectiveExtensionCompact();
        RouterMagicHandlerCompact();
    });
}
