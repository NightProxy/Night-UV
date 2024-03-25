/**
 * @type {import('../uv').UltravioletV2Ctor}
 */
const UltravioletV2 = self.UltravioletV2;

/**
 * @type {import('../uv').UVv2ClientCtor}
 */
const UVv2Client = self.UVv2Client;

/**
 * @type {import('../uv').UVv2Config}
 */
const __uvv2$config = self.__uvv2$config;

/**
 * @type {import('@tomphttp/bare-client').BareManifest}
 */
const __uvv2$bareData = self.__uvv2$bareData;

/**
 * @type {string}
 */
const __uvv2$bareURL = self.__uvv2$bareURL;

/**
 * @type {string}
 */
const __uvv2$cookies = self.__uvv2$cookies;

if (
    typeof __uvv2$bareData !== 'object' ||
    typeof __uvv2$bareURL !== 'string' ||
    typeof __uvv2$cookies !== 'string'
)
    throw new TypeError('Unable to load global UVv2 data');

if (!self.__uvv2) __uvv2Hook(self);

self.__uvv2Hook = __uvv2Hook;

/**
 *
 * @param {typeof globalThis} window
 * @returns
 */
function __uvv2Hook(window) {
    if ('__uvv2' in window && window.__uvv2 instanceof UltravioletV2) return false;

    if (window.document && !!window.window) {
        window.document
            .querySelectorAll('script[__uvv2-script]')
            .forEach((node) => node.remove());
    }

    const worker = !window.window;
    const master = '__uvv2';
    const methodPrefix = '__uvv2$';
    const __uvv2 = new UltravioletV2(__uvv2$config);

    /*if (typeof config.construct === 'function') {
        config.construct(__uvv2, worker ? 'worker' : 'window');
    }*/

    // websockets
    const bareClient = new UltravioletV2.BareClient(__uvv2$bareURL, __uvv2$bareData);

    const client = new UVv2Client(window, bareClient, worker);
    const {
        HTMLMediaElement,
        HTMLScriptElement,
        HTMLAudioElement,
        HTMLVideoElement,
        HTMLInputElement,
        HTMLEmbedElement,
        HTMLTrackElement,
        HTMLAnchorElement,
        HTMLIFrameElement,
        HTMLAreaElement,
        HTMLLinkElement,
        HTMLBaseElement,
        HTMLFormElement,
        HTMLImageElement,
        HTMLSourceElement,
    } = window;

    client.nativeMethods.defineProperty(window, '__uvv2', {
        value: __uvv2,
        enumerable: false,
    });

    __uvv2.meta.origin = location.origin;
    __uvv2.location = client.location.emulate(
        (href) => {
            if (href === 'about:srcdoc') return new URL(href);
            if (href.startsWith('blob:')) href = href.slice('blob:'.length);
            return new URL(__uvv2.sourceUrl(href));
        },
        (href) => {
            return __uvv2.rewriteUrl(href);
        }
    );

    let cookieStr = __uvv2$cookies;

    __uvv2.meta.url = __uvv2.location;
    __uvv2.domain = __uvv2.meta.url.host;
    __uvv2.blobUrls = new window.Map();
    __uvv2.referrer = '';
    __uvv2.cookies = [];
    __uvv2.localStorageObj = {};
    __uvv2.sessionStorageObj = {};

    if (__uvv2.location.href === 'about:srcdoc') {
        __uvv2.meta = window.parent.__uvv2.meta;
    }

    if (window.EventTarget) {
        __uvv2.addEventListener = window.EventTarget.prototype.addEventListener;
        __uvv2.removeListener = window.EventTarget.prototype.removeListener;
        __uvv2.dispatchEvent = window.EventTarget.prototype.dispatchEvent;
    }

    // Storage wrappers
    client.nativeMethods.defineProperty(
        client.storage.storeProto,
        '__uvv2$storageObj',
        {
            get() {
                if (this === client.storage.sessionStorage)
                    return __uvv2.sessionStorageObj;
                if (this === client.storage.localStorage)
                    return __uvv2.localStorageObj;
            },
            enumerable: false,
        }
    );

    if (window.localStorage) {
        for (const key in window.localStorage) {
            if (key.startsWith(methodPrefix + __uvv2.location.origin + '@')) {
                __uvv2.localStorageObj[
                    key.slice(
                        (methodPrefix + __uvv2.location.origin + '@').length
                    )
                ] = window.localStorage.getItem(key);
            }
        }

        __uvv2.lsWrap = client.storage.emulate(
            client.storage.localStorage,
            __uvv2.localStorageObj
        );
    }

    if (window.sessionStorage) {
        for (const key in window.sessionStorage) {
            if (key.startsWith(methodPrefix + __uvv2.location.origin + '@')) {
                __uvv2.sessionStorageObj[
                    key.slice(
                        (methodPrefix + __uvv2.location.origin + '@').length
                    )
                ] = window.sessionStorage.getItem(key);
            }
        }

        __uvv2.ssWrap = client.storage.emulate(
            client.storage.sessionStorage,
            __uvv2.sessionStorageObj
        );
    }

    let rawBase = window.document
        ? client.node.baseURI.get.call(window.document)
        : window.location.href;
    let base = __uvv2.sourceUrl(rawBase);

    client.nativeMethods.defineProperty(__uvv2.meta, 'base', {
        get() {
            if (!window.document) return __uvv2.meta.url.href;

            if (client.node.baseURI.get.call(window.document) !== rawBase) {
                rawBase = client.node.baseURI.get.call(window.document);
                base = __uvv2.sourceUrl(rawBase);
            }

            return base;
        },
    });

    __uvv2.methods = {
        setSource: methodPrefix + 'setSource',
        source: methodPrefix + 'source',
        location: methodPrefix + 'location',
        function: methodPrefix + 'function',
        string: methodPrefix + 'string',
        eval: methodPrefix + 'eval',
        parent: methodPrefix + 'parent',
        top: methodPrefix + 'top',
    };

    __uvv2.filterKeys = [
        master,
        __uvv2.methods.setSource,
        __uvv2.methods.source,
        __uvv2.methods.location,
        __uvv2.methods.function,
        __uvv2.methods.string,
        __uvv2.methods.eval,
        __uvv2.methods.parent,
        __uvv2.methods.top,
        methodPrefix + 'protocol',
        methodPrefix + 'storageObj',
        methodPrefix + 'url',
        methodPrefix + 'modifiedStyle',
        methodPrefix + 'config',
        methodPrefix + 'dispatched',
        'UltravioletV2',
        '__uvv2Hook',
    ];

    client.on('wrap', (target, wrapped) => {
        client.nativeMethods.defineProperty(
            wrapped,
            'name',
            client.nativeMethods.getOwnPropertyDescriptor(target, 'name')
        );
        client.nativeMethods.defineProperty(
            wrapped,
            'length',
            client.nativeMethods.getOwnPropertyDescriptor(target, 'length')
        );

        client.nativeMethods.defineProperty(wrapped, __uvv2.methods.string, {
            enumerable: false,
            value: client.nativeMethods.fnToString.call(target),
        });

        client.nativeMethods.defineProperty(wrapped, __uvv2.methods.function, {
            enumerable: false,
            value: target,
        });
    });

    client.fetch.on('request', (event) => {
        event.data.input = __uvv2.rewriteUrl(event.data.input);
    });

    client.fetch.on('requestUrl', (event) => {
        event.data.value = __uvv2.sourceUrl(event.data.value);
    });

    client.fetch.on('responseUrl', (event) => {
        event.data.value = __uvv2.sourceUrl(event.data.value);
    });

    // XMLHttpRequest
    client.xhr.on('open', (event) => {
        event.data.input = __uvv2.rewriteUrl(event.data.input);
    });

    client.xhr.on('responseUrl', (event) => {
        event.data.value = __uvv2.sourceUrl(event.data.value);
    });

    // Workers
    client.workers.on('worker', (event) => {
        event.data.url = __uvv2.rewriteUrl(event.data.url);
    });

    client.workers.on('addModule', (event) => {
        event.data.url = __uvv2.rewriteUrl(event.data.url);
    });

    client.workers.on('importScripts', (event) => {
        for (const i in event.data.scripts) {
            event.data.scripts[i] = __uvv2.rewriteUrl(event.data.scripts[i]);
        }
    });

    client.workers.on('postMessage', (event) => {
        let to = event.data.origin;

        event.data.origin = '*';
        event.data.message = {
            __data: event.data.message,
            __origin: __uvv2.meta.url.origin,
            __to: to,
        };
    });

    // Navigator
    client.navigator.on('sendBeacon', (event) => {
        event.data.url = __uvv2.rewriteUrl(event.data.url);
    });

    // Cookies
    client.document.on('getCookie', (event) => {
        event.data.value = cookieStr;
    });

    client.document.on('setCookie', (event) => {
        __uvv2.cookie.db().then((db) => {
            __uvv2.cookie.setCookies(event.data.value, db, __uvv2.meta);

            __uvv2.cookie.getCookies(db).then((cookies) => {
                cookieStr = __uvv2.cookie.serialize(cookies, __uvv2.meta, true);
            });
        });

        const cookie = __uvv2.cookie.setCookie(event.data.value)[0];

        if (!cookie.path) cookie.path = '/';
        if (!cookie.domain) cookie.domain = __uvv2.meta.url.hostname;

        if (__uvv2.cookie.validateCookie(cookie, __uvv2.meta, true)) {
            if (cookieStr.length) cookieStr += '; ';
            cookieStr += `${cookie.name}=${cookie.value}`;
        }

        event.respondWith(event.data.value);
    });

    // HTML
    client.element.on('setInnerHTML', (event) => {
        switch (event.that.tagName) {
            case 'SCRIPT':
                event.data.value = __uvv2.js.rewrite(event.data.value);
                break;
            case 'STYLE':
                event.data.value = __uvv2.rewriteCSS(event.data.value);
                break;
            default:
                event.data.value = __uvv2.rewriteHtml(event.data.value);
        }
    });

    client.element.on('getInnerHTML', (event) => {
        switch (event.that.tagName) {
            case 'SCRIPT':
                event.data.value = __uvv2.js.source(event.data.value);
                break;
            default:
                event.data.value = __uvv2.sourceHtml(event.data.value);
        }
    });

    client.element.on('setOuterHTML', (event) => {
        event.data.value = __uvv2.rewriteHtml(event.data.value, {
            document: event.that.tagName === 'HTML',
        });
    });

    client.element.on('getOuterHTML', (event) => {
        switch (event.that.tagName) {
            case 'HEAD':
                event.data.value = __uvv2
                    .sourceHtml(
                        event.data.value.replace(
                            /<head(.*)>(.*)<\/head>/s,
                            '<op-head$1>$2</op-head>'
                        )
                    )
                    .replace(
                        /<op-head(.*)>(.*)<\/op-head>/s,
                        '<head$1>$2</head>'
                    );
                break;
            case 'BODY':
                event.data.value = __uvv2
                    .sourceHtml(
                        event.data.value.replace(
                            /<body(.*)>(.*)<\/body>/s,
                            '<op-body$1>$2</op-body>'
                        )
                    )
                    .replace(
                        /<op-body(.*)>(.*)<\/op-body>/s,
                        '<body$1>$2</body>'
                    );
                break;
            default:
                event.data.value = __uvv2.sourceHtml(event.data.value, {
                    document: event.that.tagName === 'HTML',
                });
                break;
        }

        //event.data.value = __uvv2.sourceHtml(event.data.value, { document: event.that.tagName === 'HTML' });
    });

    client.document.on('write', (event) => {
        if (!event.data.html.length) return false;
        event.data.html = [__uvv2.rewriteHtml(event.data.html.join(''))];
    });

    client.document.on('writeln', (event) => {
        if (!event.data.html.length) return false;
        event.data.html = [__uvv2.rewriteHtml(event.data.html.join(''))];
    });

    client.element.on('insertAdjacentHTML', (event) => {
        event.data.html = __uvv2.rewriteHtml(event.data.html);
    });

    // EventSource

    client.eventSource.on('construct', (event) => {
        event.data.url = __uvv2.rewriteUrl(event.data.url);
    });

    client.eventSource.on('url', (event) => {
        event.data.url = __uvv2.rewriteUrl(event.data.url);
    });

    // IDB
    client.idb.on('idbFactoryOpen', (event) => {
        // Don't modify the UltravioletV2 cookie database
        if (event.data.name === '__op') return;
        event.data.name = `${__uvv2.meta.url.origin}@${event.data.name}`;
    });

    client.idb.on('idbFactoryName', (event) => {
        event.data.value = event.data.value.slice(
            __uvv2.meta.url.origin.length + 1 /*the @*/
        );
    });

    // History
    client.history.on('replaceState', (event) => {
        if (event.data.url)
            event.data.url = __uvv2.rewriteUrl(
                event.data.url,
                '__uvv2' in event.that ? event.that.__uvv2.meta : __uvv2.meta
            );
    });
    client.history.on('pushState', (event) => {
        if (event.data.url)
            event.data.url = __uvv2.rewriteUrl(
                event.data.url,
                '__uvv2' in event.that ? event.that.__uvv2.meta : __uvv2.meta
            );
    });

    // Element get set attribute methods
    client.element.on('getAttribute', (event) => {
        if (
            client.element.hasAttribute.call(
                event.that,
                __uvv2.attributePrefix + '-attr-' + event.data.name
            )
        ) {
            event.respondWith(
                event.target.call(
                    event.that,
                    __uvv2.attributePrefix + '-attr-' + event.data.name
                )
            );
        }
    });

    // Message
    client.message.on('postMessage', (event) => {
        let to = event.data.origin;
        let call = __uvv2.call;

        if (event.that) {
            call = event.that.__uvv2$source.call;
        }

        event.data.origin = '*';
        event.data.message = {
            __data: event.data.message,
            __origin: (event.that || event.target).__uvv2$source.location.origin,
            __to: to,
        };

        event.respondWith(
            worker
                ? call(
                      event.target,
                      [event.data.message, event.data.transfer],
                      event.that
                  )
                : call(
                      event.target,
                      [
                          event.data.message,
                          event.data.origin,
                          event.data.transfer,
                      ],
                      event.that
                  )
        );
    });

    client.message.on('data', (event) => {
        const { value: data } = event.data;
        if (
            typeof data === 'object' &&
            '__data' in data &&
            '__origin' in data
        ) {
            event.respondWith(data.__data);
        }
    });

    client.message.on('origin', (event) => {
        const data = client.message.messageData.get.call(event.that);
        if (typeof data === 'object' && data.__data && data.__origin) {
            event.respondWith(data.__origin);
        }
    });

    client.overrideDescriptor(window, 'origin', {
        get: () => {
            return __uvv2.location.origin;
        },
    });

    client.node.on('baseURI', (event) => {
        if (event.data.value.startsWith(window.location.origin))
            event.data.value = __uvv2.sourceUrl(event.data.value);
    });

    client.element.on('setAttribute', (event) => {
        if (
            event.that instanceof HTMLMediaElement &&
            event.data.name === 'src' &&
            event.data.value.startsWith('blob:')
        ) {
            event.target.call(
                event.that,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.blobUrls.get(event.data.value);
            return;
        }

        if (__uvv2.attrs.isUrl(event.data.name)) {
            event.target.call(
                event.that,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.rewriteUrl(event.data.value);
        }

        if (__uvv2.attrs.isStyle(event.data.name)) {
            event.target.call(
                event.that,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.rewriteCSS(event.data.value, {
                context: 'declarationList',
            });
        }

        if (__uvv2.attrs.isHtml(event.data.name)) {
            event.target.call(
                event.that,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.rewriteHtml(event.data.value, {
                ...__uvv2.meta,
                document: true,
                injectHead: __uvv2.createHtmlInject(
                    __uvv2.handlerScript,
                    __uvv2.bundleScript,
                    __uvv2.clientScript,
                    __uvv2.configScript,
                    __uvv2$bareURL,
                    __uvv2$bareData,
                    cookieStr,
                    window.location.href
                ),
            });
        }

        if (__uvv2.attrs.isSrcset(event.data.name)) {
            event.target.call(
                event.that,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.html.wrapSrcset(
                event.data.value.toString()
            );
        }

        if (__uvv2.attrs.isForbidden(event.data.name)) {
            event.data.name = __uvv2.attributePrefix + '-attr-' + event.data.name;
        }
    });

    client.element.on('audio', (event) => {
        event.data.url = __uvv2.rewriteUrl(event.data.url);
    });

    // Element Property Attributes
    client.element.hookProperty(
        [HTMLAnchorElement, HTMLAreaElement, HTMLLinkElement, HTMLBaseElement],
        'href',
        {
            get: (target, that) => {
                return __uvv2.sourceUrl(target.call(that));
            },
            set: (target, that, [val]) => {
                client.element.setAttribute.call(
                    that,
                    __uvv2.attributePrefix + '-attr-href',
                    val
                );
                target.call(that, __uvv2.rewriteUrl(val));
            },
        }
    );

    client.element.hookProperty(
        [
            HTMLScriptElement,
            HTMLAudioElement,
            HTMLVideoElement,
            HTMLMediaElement,
            HTMLImageElement,
            HTMLInputElement,
            HTMLEmbedElement,
            HTMLIFrameElement,
            HTMLTrackElement,
            HTMLSourceElement,
        ],
        'src',
        {
            get: (target, that) => {
                return __uvv2.sourceUrl(target.call(that));
            },
            set: (target, that, [val]) => {
                if (
                    new String(val).toString().trim().startsWith('blob:') &&
                    that instanceof HTMLMediaElement
                ) {
                    client.element.setAttribute.call(
                        that,
                        __uvv2.attributePrefix + '-attr-src',
                        val
                    );
                    return target.call(that, __uvv2.blobUrls.get(val) || val);
                }

                client.element.setAttribute.call(
                    that,
                    __uvv2.attributePrefix + '-attr-src',
                    val
                );
                target.call(that, __uvv2.rewriteUrl(val));
            },
        }
    );

    client.element.hookProperty([HTMLFormElement], 'action', {
        get: (target, that) => {
            return __uvv2.sourceUrl(target.call(that));
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(
                that,
                __uvv2.attributePrefix + '-attr-action',
                val
            );
            target.call(that, __uvv2.rewriteUrl(val));
        },
    });

    client.element.hookProperty([HTMLImageElement], 'srcset', {
        get: (target, that) => {
            return (
                client.element.getAttribute.call(
                    that,
                    __uvv2.attributePrefix + '-attr-srcset'
                ) || target.call(that)
            );
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(
                that,
                __uvv2.attributePrefix + '-attr-srcset',
                val
            );
            target.call(that, __uvv2.html.wrapSrcset(val.toString()));
        },
    });

    client.element.hookProperty(HTMLScriptElement, 'integrity', {
        get: (target, that) => {
            return client.element.getAttribute.call(
                that,
                __uvv2.attributePrefix + '-attr-integrity'
            );
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(
                that,
                __uvv2.attributePrefix + '-attr-integrity',
                val
            );
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'sandbox', {
        get: (target, that) => {
            return (
                client.element.getAttribute.call(
                    that,
                    __uvv2.attributePrefix + '-attr-sandbox'
                ) || target.call(that)
            );
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(
                that,
                __uvv2.attributePrefix + '-attr-sandbox',
                val
            );
        },
    });

    // HTMLIFrameElement may not be defined (workers)
    const contentWindowGet =
        HTMLIFrameElement &&
        Object.getOwnPropertyDescriptor(
            HTMLIFrameElement.prototype,
            'contentWindow'
        ).get;

    function uvInject(that) {
        const win = contentWindowGet.call(that);

        if (!win.__uvv2)
            try {
                __uvv2Hook(win);
            } catch (e) {
                console.error('catastrophic failure');
                console.error(e);
            }
    }

    client.element.hookProperty(HTMLIFrameElement, 'contentWindow', {
        get: (target, that) => {
            uvInject(that);
            return target.call(that);
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'contentDocument', {
        get: (target, that) => {
            uvInject(that);
            return target.call(that);
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'srcdoc', {
        get: (target, that) => {
            return (
                client.element.getAttribute.call(
                    that,
                    __uvv2.attributePrefix + '-attr-srcdoc'
                ) || target.call(that)
            );
        },
        set: (target, that, [val]) => {
            target.call(
                that,
                __uvv2.rewriteHtml(val, {
                    document: true,
                    injectHead: __uvv2.createHtmlInject(
                        __uvv2.handlerScript,
                        __uvv2.bundleScript,
                        __uvv2.clientScript,
                        __uvv2.configScript,
                        __uvv2$bareURL,
                        __uvv2$bareData,
                        cookieStr,
                        window.location.href
                    ),
                })
            );
        },
    });

    client.node.on('getTextContent', (event) => {
        if (event.that.tagName === 'SCRIPT') {
            event.data.value = __uvv2.js.source(event.data.value);
        }
    });

    client.node.on('setTextContent', (event) => {
        if (event.that.tagName === 'SCRIPT') {
            event.data.value = __uvv2.js.rewrite(event.data.value);
        }
    });

    // Until proper rewriting is implemented for service workers.
    // Not sure atm how to implement it with the already built in service worker
    if ('serviceWorker' in window.navigator) {
        delete window.Navigator.prototype.serviceWorker;
    }

    // Document
    client.document.on('getDomain', (event) => {
        event.data.value = __uvv2.domain;
    });
    client.document.on('setDomain', (event) => {
        if (
            !event.data.value
                .toString()
                .endsWith(__uvv2.meta.url.hostname.split('.').slice(-2).join('.'))
        )
            return event.respondWith('');
        event.respondWith((__uvv2.domain = event.data.value));
    });

    client.document.on('url', (event) => {
        event.data.value = __uvv2.location.href;
    });

    client.document.on('documentURI', (event) => {
        event.data.value = __uvv2.location.href;
    });

    client.document.on('referrer', (event) => {
        event.data.value = __uvv2.referrer || __uvv2.sourceUrl(event.data.value);
    });

    client.document.on('parseFromString', (event) => {
        if (event.data.type !== 'text/html') return false;
        event.data.string = __uvv2.rewriteHtml(event.data.string, {
            ...__uvv2.meta,
            document: true,
        });
    });

    // Attribute (node.attributes)
    client.attribute.on('getValue', (event) => {
        if (
            client.element.hasAttribute.call(
                event.that.ownerElement,
                __uvv2.attributePrefix + '-attr-' + event.data.name
            )
        ) {
            event.data.value = client.element.getAttribute.call(
                event.that.ownerElement,
                __uvv2.attributePrefix + '-attr-' + event.data.name
            );
        }
    });

    client.attribute.on('setValue', (event) => {
        if (__uvv2.attrs.isUrl(event.data.name)) {
            client.element.setAttribute.call(
                event.that.ownerElement,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.rewriteUrl(event.data.value);
        }

        if (__uvv2.attrs.isStyle(event.data.name)) {
            client.element.setAttribute.call(
                event.that.ownerElement,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.rewriteCSS(event.data.value, {
                context: 'declarationList',
            });
        }

        if (__uvv2.attrs.isHtml(event.data.name)) {
            client.element.setAttribute.call(
                event.that.ownerElement,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.rewriteHtml(event.data.value, {
                ...__uvv2.meta,
                document: true,
                injectHead: __uvv2.createHtmlInject(
                    __uvv2.handlerScript,
                    __uvv2.bundleScript,
                    __uvv2.clientScript,
                    __uvv2.configScript,
                    __uvv2$bareURL,
                    __uvv2$bareData,
                    cookieStr,
                    window.location.href
                ),
            });
        }

        if (__uvv2.attrs.isSrcset(event.data.name)) {
            client.element.setAttribute.call(
                event.that.ownerElement,
                __uvv2.attributePrefix + '-attr-' + event.data.name,
                event.data.value
            );
            event.data.value = __uvv2.html.wrapSrcset(
                event.data.value.toString()
            );
        }
    });

    // URL
    client.url.on('createObjectURL', (event) => {
        let url = event.target.call(event.that, event.data.object);
        if (url.startsWith('blob:' + location.origin)) {
            let newUrl =
                'blob:' +
                (__uvv2.meta.url.href !== 'about:blank'
                    ? __uvv2.meta.url.origin
                    : window.parent.__uvv2.meta.url.origin) +
                url.slice('blob:'.length + location.origin.length);
            __uvv2.blobUrls.set(newUrl, url);
            event.respondWith(newUrl);
        } else {
            event.respondWith(url);
        }
    });

    client.url.on('revokeObjectURL', (event) => {
        if (__uvv2.blobUrls.has(event.data.url)) {
            const old = event.data.url;
            event.data.url = __uvv2.blobUrls.get(event.data.url);
            __uvv2.blobUrls.delete(old);
        }
    });

    client.storage.on('get', (event) => {
        event.data.name =
            methodPrefix + __uvv2.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('set', (event) => {
        if (event.that.__uvv2$storageObj) {
            event.that.__uvv2$storageObj[event.data.name] = event.data.value;
        }
        event.data.name =
            methodPrefix + __uvv2.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('delete', (event) => {
        if (event.that.__uvv2$storageObj) {
            delete event.that.__uvv2$storageObj[event.data.name];
        }
        event.data.name =
            methodPrefix + __uvv2.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('getItem', (event) => {
        event.data.name =
            methodPrefix + __uvv2.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('setItem', (event) => {
        if (event.that.__uvv2$storageObj) {
            event.that.__uvv2$storageObj[event.data.name] = event.data.value;
        }
        event.data.name =
            methodPrefix + __uvv2.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('removeItem', (event) => {
        if (event.that.__uvv2$storageObj) {
            delete event.that.__uvv2$storageObj[event.data.name];
        }
        event.data.name =
            methodPrefix + __uvv2.meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('clear', (event) => {
        if (event.that.__uvv2$storageObj) {
            for (const key of client.nativeMethods.keys.call(
                null,
                event.that.__uvv2$storageObj
            )) {
                delete event.that.__uvv2$storageObj[key];
                client.storage.removeItem.call(
                    event.that,
                    methodPrefix + __uvv2.meta.url.origin + '@' + key
                );
                event.respondWith();
            }
        }
    });

    client.storage.on('length', (event) => {
        if (event.that.__uvv2$storageObj) {
            event.respondWith(
                client.nativeMethods.keys.call(null, event.that.__uvv2$storageObj)
                    .length
            );
        }
    });

    client.storage.on('key', (event) => {
        if (event.that.__uvv2$storageObj) {
            event.respondWith(
                client.nativeMethods.keys.call(
                    null,
                    event.that.__uvv2$storageObj
                )[event.data.index] || null
            );
        }
    });

    client.websocket.on('websocket', async (event) => {
        const requestHeaders = Object.create(null);
        requestHeaders['Origin'] = __uvv2.meta.url.origin;
        requestHeaders['User-Agent'] = navigator.userAgent;

        if (cookieStr !== '') requestHeaders['Cookie'] = cookieStr.toString();

        event.respondWith(
            bareClient.createWebSocket(event.data.args[0], event.data.args[1], {
                headers: requestHeaders,
                readyStateHook: (socket, getReadyState) => {
                    socket.__uvv2$getReadyState = getReadyState;
                },
                sendErrorHook: (socket, getSendError) => {
                    socket.__uvv2$getSendError = getSendError;
                },
                urlHook: (socket, url) => {
                    socket.__uvv2$socketUrl = url;
                },
                protocolHook: (socket, getProtocol) => {
                    socket.__uvv2$getProtocol = getProtocol;
                },
                setCookiesCallback: (setCookies) => {
                    // document.cookie is hooked
                    // so we can just call it
                    for (const cookie of setCookies)
                        window.document.cookie = cookie;
                },
                webSocketImpl: event.target,
            })
        );
    });

    client.websocket.on('readyState', (event) => {
        if ('__uvv2$getReadyState' in event.that)
            event.data.value = event.that.__uvv2$getReadyState();
    });

    client.websocket.on('send', (event) => {
        if ('__uvv2$getSendError' in event.that) {
            const error = event.that.__uvv2$getSendError();
            if (error) throw error;
        }
    });

    client.websocket.on('url', (event) => {
        if ('__uvv2$socketUrl' in event.that)
            event.data.value = event.that.__uvv2$socketUrl.toString();
    });

    client.websocket.on('protocol', (event) => {
        if ('__uvv2$getProtocol' in event.that)
            event.data.value = event.that.__uvv2$getProtocol();
    });

    client.function.on('function', (event) => {
        event.data.script = __uvv2.rewriteJS(event.data.script);
    });

    client.function.on('toString', (event) => {
        if (__uvv2.methods.string in event.that)
            event.respondWith(event.that[__uvv2.methods.string]);
    });

    client.object.on('getOwnPropertyNames', (event) => {
        event.data.names = event.data.names.filter(
            (element) => !__uvv2.filterKeys.includes(element)
        );
    });

    client.object.on('getOwnPropertyDescriptors', (event) => {
        for (const forbidden of __uvv2.filterKeys) {
            delete event.data.descriptors[forbidden];
        }
    });

    client.style.on('setProperty', (event) => {
        if (client.style.dashedUrlProps.includes(event.data.property)) {
            event.data.value = __uvv2.rewriteCSS(event.data.value, {
                context: 'value',
                ...__uvv2.meta,
            });
        }
    });

    client.style.on('getPropertyValue', (event) => {
        if (client.style.dashedUrlProps.includes(event.data.property)) {
            event.respondWith(
                __uvv2.sourceCSS(
                    event.target.call(event.that, event.data.property),
                    {
                        context: 'value',
                        ...__uvv2.meta,
                    }
                )
            );
        }
    });

    if ('CSS2Properties' in window) {
        for (const key of client.style.urlProps) {
            client.overrideDescriptor(window.CSS2Properties.prototype, key, {
                get: (target, that) => {
                    return __uvv2.sourceCSS(target.call(that), {
                        context: 'value',
                        ...__uvv2.meta,
                    });
                },
                set: (target, that, val) => {
                    target.call(
                        that,
                        __uvv2.rewriteCSS(val, {
                            context: 'value',
                            ...__uvv2.meta,
                        })
                    );
                },
            });
        }
    } else if ('HTMLElement' in window) {
        client.overrideDescriptor(window.HTMLElement.prototype, 'style', {
            get: (target, that) => {
                const value = target.call(that);
                if (!value[methodPrefix + 'modifiedStyle']) {
                    for (const key of client.style.urlProps) {
                        client.nativeMethods.defineProperty(value, key, {
                            enumerable: true,
                            configurable: true,
                            get() {
                                const value =
                                    client.style.getPropertyValue.call(
                                        this,
                                        key
                                    ) || '';
                                return __uvv2.sourceCSS(value, {
                                    context: 'value',
                                    ...__uvv2.meta,
                                });
                            },
                            set(val) {
                                client.style.setProperty.call(
                                    this,
                                    client.style.propToDashed[key] || key,
                                    __uvv2.rewriteCSS(val, {
                                        context: 'value',
                                        ...__uvv2.meta,
                                    })
                                );
                            },
                        });
                        client.nativeMethods.defineProperty(
                            value,
                            methodPrefix + 'modifiedStyle',
                            {
                                enumerable: false,
                                value: true,
                            }
                        );
                    }
                }
                return value;
            },
        });
    }

    client.style.on('setCssText', (event) => {
        event.data.value = __uvv2.rewriteCSS(event.data.value, {
            context: 'declarationList',
            ...__uvv2.meta,
        });
    });

    client.style.on('getCssText', (event) => {
        event.data.value = __uvv2.sourceCSS(event.data.value, {
            context: 'declarationList',
            ...__uvv2.meta,
        });
    });

    // Proper hash emulation.
    __uvv2.addEventListener.call(window, 'hashchange', (event) => {
        if (event.__uvv2$dispatched) return false;
        event.stopImmediatePropagation();
        const hash = window.location.hash;
        client.history.replaceState.call(window.history, '', '', event.oldURL);
        __uvv2.location.hash = hash;
    });

    client.location.on('hashchange', (oldUrl, newUrl, ctx) => {
        if (ctx.HashChangeEvent && client.history.replaceState) {
            client.history.replaceState.call(
                window.history,
                '',
                '',
                __uvv2.rewriteUrl(newUrl)
            );

            const event = new ctx.HashChangeEvent('hashchange', {
                newURL: newUrl,
                oldURL: oldUrl,
            });

            client.nativeMethods.defineProperty(
                event,
                methodPrefix + 'dispatched',
                {
                    value: true,
                    enumerable: false,
                }
            );

            __uvv2.dispatchEvent.call(window, event);
        }
    });

    // Hooking functions & descriptors
    client.fetch.overrideRequest();
    client.fetch.overrideUrl();
    client.xhr.overrideOpen();
    client.xhr.overrideResponseUrl();
    client.element.overrideHtml();
    client.element.overrideAttribute();
    client.element.overrideInsertAdjacentHTML();
    client.element.overrideAudio();
    // client.element.overrideQuerySelector();
    client.node.overrideBaseURI();
    client.node.overrideTextContent();
    client.attribute.overrideNameValue();
    client.document.overrideDomain();
    client.document.overrideURL();
    client.document.overrideDocumentURI();
    client.document.overrideWrite();
    client.document.overrideReferrer();
    client.document.overrideParseFromString();
    client.storage.overrideMethods();
    client.storage.overrideLength();
    //client.document.overrideQuerySelector();
    client.object.overrideGetPropertyNames();
    client.object.overrideGetOwnPropertyDescriptors();
    client.idb.overrideName();
    client.idb.overrideOpen();
    client.history.overridePushState();
    client.history.overrideReplaceState();
    client.eventSource.overrideConstruct();
    client.eventSource.overrideUrl();
    client.websocket.overrideWebSocket();
    client.websocket.overrideProtocol();
    client.websocket.overrideURL();
    client.websocket.overrideReadyState();
    client.websocket.overrideProtocol();
    client.websocket.overrideSend();
    client.url.overrideObjectURL();
    client.document.overrideCookie();
    client.message.overridePostMessage();
    client.message.overrideMessageOrigin();
    client.message.overrideMessageData();
    client.workers.overrideWorker();
    client.workers.overrideAddModule();
    client.workers.overrideImportScripts();
    client.workers.overridePostMessage();
    client.style.overrideSetGetProperty();
    client.style.overrideCssText();
    client.navigator.overrideSendBeacon();
    client.function.overrideFunction();
    client.function.overrideToString();
    client.location.overrideWorkerLocation((href) => {
        return new URL(__uvv2.sourceUrl(href));
    });

    client.overrideDescriptor(window, 'localStorage', {
        get: (target, that) => {
            return (that || window).__uvv2.lsWrap;
        },
    });
    client.overrideDescriptor(window, 'sessionStorage', {
        get: (target, that) => {
            return (that || window).__uvv2.ssWrap;
        },
    });

    client.override(window, 'open', (target, that, args) => {
        if (!args.length) return target.apply(that, args);
        let [url] = args;

        url = __uvv2.rewriteUrl(url);

        return target.call(that, url);
    });

    __uvv2.$wrap = function (name) {
        if (name === 'location') return __uvv2.methods.location;
        if (name === 'eval') return __uvv2.methods.eval;
        return name;
    };

    __uvv2.$get = function (that) {
        if (that === window.location) return __uvv2.location;
        if (that === window.eval) return __uvv2.eval;
        if (that === window.parent) {
            return window.__uvv2$parent;
        }
        if (that === window.top) {
            return window.__uvv2$top;
        }
        return that;
    };

    __uvv2.eval = client.wrap(window, 'eval', (target, that, args) => {
        if (!args.length || typeof args[0] !== 'string')
            return target.apply(that, args);
        let [script] = args;

        script = __uvv2.rewriteJS(script);
        return target.call(that, script);
    });

    __uvv2.call = function (target, args, that) {
        return that ? target.apply(that, args) : target(...args);
    };

    __uvv2.call$ = function (obj, prop, args = []) {
        return obj[prop].apply(obj, args);
    };

    client.nativeMethods.defineProperty(window.Object.prototype, master, {
        get: () => {
            return __uvv2;
        },
        enumerable: false,
    });

    client.nativeMethods.defineProperty(
        window.Object.prototype,
        __uvv2.methods.setSource,
        {
            value: function (source) {
                if (!client.nativeMethods.isExtensible(this)) return this;

                client.nativeMethods.defineProperty(this, __uvv2.methods.source, {
                    value: source,
                    writable: true,
                    enumerable: false,
                });

                return this;
            },
            enumerable: false,
        }
    );

    client.nativeMethods.defineProperty(
        window.Object.prototype,
        __uvv2.methods.source,
        {
            value: __uvv2,
            writable: true,
            enumerable: false,
        }
    );

    client.nativeMethods.defineProperty(
        window.Object.prototype,
        __uvv2.methods.location,
        {
            configurable: true,
            get() {
                return this === window.document || this === window
                    ? __uvv2.location
                    : this.location;
            },
            set(val) {
                if (this === window.document || this === window) {
                    __uvv2.location.href = val;
                } else {
                    this.location = val;
                }
            },
        }
    );

    client.nativeMethods.defineProperty(
        window.Object.prototype,
        __uvv2.methods.parent,
        {
            configurable: true,
            get() {
                const val = this.parent;

                if (this === window) {
                    try {
                        return '__uvv2' in val ? val : this;
                    } catch (e) {
                        return this;
                    }
                }
                return val;
            },
            set(val) {
                this.parent = val;
            },
        }
    );

    client.nativeMethods.defineProperty(
        window.Object.prototype,
        __uvv2.methods.top,
        {
            configurable: true,
            get() {
                const val = this.top;

                if (this === window) {
                    if (val === this.parent) return this[__uvv2.methods.parent];
                    try {
                        if (!('__uvv2' in val)) {
                            let current = this;

                            while (current.parent !== val) {
                                current = current.parent;
                            }

                            return '__uvv2' in current ? current : this;
                        } else {
                            return val;
                        }
                    } catch (e) {
                        return this;
                    }
                }
                return val;
            },
            set(val) {
                this.top = val;
            },
        }
    );

    client.nativeMethods.defineProperty(
        window.Object.prototype,
        __uvv2.methods.eval,
        {
            configurable: true,
            get() {
                return this === window ? __uvv2.eval : this.eval;
            },
            set(val) {
                this.eval = val;
            },
        }
    );
}
