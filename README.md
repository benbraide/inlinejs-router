# InlineJS Router Plugin

[![npm (scoped)](https://img.shields.io/npm/v/@benbraide/inlinejs-router.svg)](https://www.npmjs.com/package/@benbraide/inlinejs-router) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/minzip/@benbraide/inlinejs-router.svg)](https://www.npmjs.com/package/@benbraide/inlinejs-router)

This is a plugin for the [InlineJS Framework](https://github.com/benbraide/InlineJS), enabling client side routing.

> :loudspeaker: Routing supports `transitions` and `animations` on data load.

## Install

- Grab source or distribution versions from `GitHub`
- Include script in your HTML file.


## CDNs

```html
<script  src="https://cdn.jsdelivr.net/npm/@benbraide/inlinejs-router@1.x.x/dist/inlinejs-router.js"></script>

<script  src="https://cdn.jsdelivr.net/npm/@benbraide/inlinejs-router@1.x.x/dist/inlinejs-router.min.js"></script>
```

## NPM Install

```
npm install @benbraide/inlinejs-router
```

## Reference

Available directives:

| Directive | Description |
| --- | --- |
| [`x-router`](#x-router) | Used as the base directive for other extensions. |

Available directive extensions:

| Extension | Description |
| --- | --- |
| [`page`](#page) | Registers a path as a new page. |
| [`fetch`](#fetch) | Registers a fetch handler for a specific path or pattern. |
| [`mount`](#mount) | Directs the router concept where to render fetched data. |
| [`link`](#link) | Binds an `a` or `form` element as a link to activate a path. |

Available events:

| Event | Description |
| --- | --- |
| `load` | Fired when a page has been loaded. |
| `reload` | Fired when the specified path is the same as the previous path and `reload` option is not set. |
| `error` | Fired when an error occurs while retrieving data for a loading page. |
| `404` | Fired when the specified path does not match any of the registered pages. |
| `entered` | Fired when a page load is initiated. |
| `page` | Fired when the processed path points to a new page. |
| `path` | Fired when the specified path is different from the previous one. |

**Example:**
```html
<template x-router:load="console.log('Page details:', $event.detail)"></template>
```
> These events can also be subscribed to using the `x-on` core directive. Example:
> **`<template x-on:router-load.join.window="..."></template>`**
> **Note:** These events are fired on the global window object. That is why the `x-on` example above includes a `.window` modifier.

Available mount events:

| Event | Description |
| --- | --- |
| `load` | Fired when the data is swapped |
| `reload` | Fired when data is swapped, but the path is the same as the previous one. |
| `entered` | Fired when a data swapping is initiated. |

**Example:**
```html
<template x-router:mount-load="console.log('Load details:', $event.detail)"></template>
```
> These events can also be subscribed to using the `x-on` core directive. Example:
> **`<template x-on:router-mount-load.join="..."></template>`**
> **Note:** These events are preceded by a `mount-`.

Available magic properties:

| Property | Description |
| --- | --- |
| [`$router`](#$router) | Exposes methods used for interacting with the `router` concept. |

### Directives
---

### `x-router`

`x-router` Used as the base directive for other extensions. By itself it does nothing.

### Directive Extensions
---

### `page`

`x-router:page` Registers a path as a new page.
> **Notes:**
> - Pages must be registered before they can be requested/visited.
> - Registered page is removed when element with directive is removed from the DOM.

**Examples:**

- Specifying a static path:
```html
<template x-router:page="/about"></template>
```
- Specifying a pattern path:
```html
<template x-router:page.evaluate="/^\/cust.*/"></template>
```
- Specifying a register object:
```html
<template x-router:page.evaluate="{ path: '/about', name: 'about', title: 'About Us', cache: true, reload: false }"></template>
```
> **Note:** The only required property of the register object is the `path`.

- Specifying a path that should be cached:
```html
<template x-router:page.cache="/about"></template>
```
- Specifying a path that should always be reloaded:
```html
<template x-router:page.reload="/fragile"></template>
```

### `fetch`

`x-router:fetch` Registers a fetch handler for a specific path or pattern.

**Examples:**

- Using the `innerHtml` content as data:
```html
<template x-router:fetch="/about">
    <p>This page is about a service.</p>
</template>
```
- Using the `innerHtml` content as data with placeholders:
```html
<template x-router:fetch="/users/:id">
    <p>Specified user has an ID of {: $params.id :}.</p>
</template>
```
- Using the `innerHtml` content as data with optional placeholders:
```html
<template x-router:fetch="/users/:id?">
    <p>Specified user has an ID of {: $params.id || 'Nil' :}.</p>
</template>
```
- Using the `innerHtml` content as data with typed placeholders:
```html
<template x-router:fetch="/users/:id:integer">
    <p>Specified user has an ID of {: $params.id :}.</p>
</template>
```
- Using callback as data:
```html
<template x-router:fetch.evaluate="{ path: '/about', handler: () => '<p>This page is about a service.</p>' }"></template>
```
- Using callback as data with placeholders:
```html
<template x-router:fetch.evaluate="{ path: '/users/:id', handler: ({ params }) => `<p>Specified user has an ID of ${params.id}.</p>` }"></template>
```
- Using callback as data with optional placeholders:
```html
<template x-router:fetch.evaluate="{ path: '/users/:id?', handler: ({ params }) => `<p>Specified user has an ID of ${params.id || 'Nil'}.</p>` }"></template>
```
- Intercepting all requests:
```html
<template x-router:fetch.evaluate="() => '<p>Handling all requests</p>'"></template>
```

### `mount`

`x-router:mount` Directs the router concept where to render fetched data.

**Examples:**

- Specifying the default mount point:
```html
<template x-router:mount></template>
```
- Specifying a mount point for a specific "protocol":
```html
<template x-router:mount="modal"></template>
```
- Specifying a different DOM element as mount point:
```html
<template x-router:mount.evaluate="document.querySelector('#router-mount')"></template>
```
- Specifying a mount object:
```html
<template x-router:mount.evaluate="{ protocol: 'modal', target: document.querySelector('#router-mount') }"></template>
```

### `link`

`x-router:link` Binds an `a` or `form` element as a link to activate a path.

**Examples:**

- Binding to an `a` element with `href` attribute:
```html
<a href="/about" x-router:link></a>
```
- Binding to a `form` element with `action` attribute:
```html
<form method="get" action="/search" x-router:link>
    <input name="query">
    <button type="submit">Search</button>
</form>
```
> When the form above is submitted, a fetch request is made with the URL: `/search?query=[Input Value]` to the router.

- Binding to an `a` element specifying to always reload data:
```html
<a href="/about" x-router:link.reload></a>
```
- Binding to an `a` element and listening for active state changes:
```html
<a href="/about" x-router:link="console.log('Active state:', $active)"></a>
```

> **Note:** `x-router:link` exposes a `$active` context property when evaluating the specified expression.

### Magic Properties
---

### `$router`

`$router` Exposes the following methods:
| Method | Description |
| --- | --- |
|`setPrefix`|sets a prefix, to be prepended on fetch requests, on the router concept. **Syntax:** `$router.setPrefix(prefix: string): void`.|
|`addMiddleware`|adds a middleware to intercept page load requests. **Syntax:** `$router.addMiddleware(middleware: IRouterMiddleware): string`.|
|`removeMiddleware`|removes a middleware from the list. **Syntax:** `$router.removeMiddleware(middleware: IRouterMiddleware | string): void`.|
|`addFetcher`|adds a fetcher to intercept fetch requests. **Syntax:** `$router.addFetcher(fetcher: IRouterFetcher): void`.|
|`removeFetcher`|removes a fetcher from the list. **Syntax:** `$router.removeFetcher(fetcher: IRouterFetcher): void`.|
|`addProtocolHandler`|adds a protocol handler to respond to the specified protocol. **Syntax:** `$router.addProtocolHandler(protocol: string | RegExp, handler: RouterProtocolHandlerType): void`.|
|`removeProtocolHandler`|removes a protocol handler from the list. **Syntax:** `$router.removeFetcher(handler: RouterProtocolHandlerType): void`.|
|`addPage`|registers a new page. **Syntax:** `$router.addPage(page: IRouterPageOptions): string`.|
|`removePage`|removes a registered page. **Syntax:** `$router.removePage(page: string | IRouterPageName): void`.|
|`findPage`|searches for page from the list. **Syntax:** `$router.findPage(page: string | IRouterPageName): IRouterPage | null`.|
|`findMatchingPage`|searches for page that would handle the specified path. **Syntax:** `$router.findPage(path: string): IRouterPage | null`.|
|`mount`|initializes the router concept on the webpage. **Syntax:** `$router.mount(load?: boolean): void`.|
|`goto`|instructs the router concept to visit a path. **Syntax:** `$router.goto(path: string | ISplitPath | IRouterPageName, shouldReload?: boolean, data?: any): void`.|
|`reload`|reloads the current path. **Syntax:** `$router.reload(): void`.|
|`getCurrentPath`|returns the current path. **Syntax:** `$router.getCurrentPath(): string`.|
|`getActivePage`|returns the current active page. **Syntax:** `$router.getActivePage(): IRouterPage | null`.|
|`getActivePageData`|returns the data associated with the specified key on the current page. **Syntax:** `$router.getActivePageData(key?: string): any`.|

## Security

If you find a security vulnerability, please send an email to [benplaeska@gmail.com]()

`InlineJS` relies on a custom implementation using the `Function` object to evaluate its directives. Despite being more secure then `eval()`, its use is prohibited in some environments, such as Google Chrome App, using restrictive Content Security Policy (CSP).

If you use `InlineJS` in a website dealing with sensitive data and requiring [CSP](https://csp.withgoogle.com/docs/strict-csp.html), you need to include `unsafe-eval` in your policy. A robust policy correctly configured will help protecting your users when using personal or financial data.

Since a policy applies to all scripts in your page, it's important that other external libraries included in the website are carefully reviewed to ensure that they are trustworthy and they won't introduce any Cross Site Scripting vulnerability either using the `eval()` function or manipulating the DOM to inject malicious code in your page.

## License

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.
