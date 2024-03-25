const UltravioletV2: typeof import('./src/rewrite/index').default;
const UVv2Client: typeof import('./src/client/index').default;
export type UltravioletV2Ctor = typeof UltravioletV2;
export type UVv2ClientCtor = typeof UVv2Client;

/**
 * The proxy part of the URL.
 */
type Coded = string;

/**
 * The URL encoder.
 * Encoders will have to encode the result using encodeURLComponent.
 */
export type UVv2Encode = (input: Coded) => string;

/**
 * The URL encoder.     
 * Decoders will have to decode the input first using decodeURLComponent.
 */
export type UVv2Decode = (input: Coded) => string;


export type MiddlewareFunction = (request: Request) => Request | Response;
export type InjectFunction = (url: URL ) => string;
/**
 * The UltravioletV2 configuration object.
 * This interface defines the configuration options for the UltravioletV2 library.
 */
export interface UVv2Config {
    middleware?: MiddlewareFunction;
    inject?: InjectFunction;
    /**
     * The Bare server(s) to use.
     * If an array is specified, the service worker will randomly select a server to use.
     * The selected server will be used for the duration of the session.
     * Both relative and absolute paths are accepted. Relative paths are resolved to the current URL.
     * @example // A Bare server running on the subdomain `bare.`, automatically correcting the apex record:
     * `${location.protocol}//bare.${location.host.replace(/^www\./, "")}
     * @example `http://localhost:8080/`
     * @example `http://localhost:8080/bare/`
     * @defaultValue `/bare/`
     * @see {@link|https://github.com/tomphttp/specifications/blob/master/BareServer.md}
     */
    bare?: string | string[];
    /**
     * The prefix for UltravioletV2 to listen on.
     * This prefix will be used to create the URL for the service worker and the client script.
     * @example `https://example.org/uv/service/`
     * @example `/uv/service/`
     * @defaultValue `/service/`
     */
    prefix?: string;
    /**
     * The path to the UltravioletV2 client script.
     * This script will be loaded by the browser and is responsible for communicating with the service worker.
     * Both relative and absolute paths are accepted. Relative paths are resolved to the current URL
     * @example `/uv/uv.client.js`,
     * @defaultValue `/uv.client.js` or if bundle is specified and the filename is `uv.bundle.js`, the directory of the bundle + `uv.client.js` will be used automatically
     */
    client?: string;
    /**
     * The path to the UltravioletV2 service worker script.
     * This script will be registered as a service worker and is responsible for handling network requests.
     * Both relative and absolute paths are accepted. Relative paths are resolved to the current URL
     * @example `/uv/uv.sw.js`,
     * @defaultValue `/uv.sw.js`
     */
    handler?: string;
    /**
     * The path to the bundled script that contains both the UltravioletV2 client and service worker scripts.
     * This path is optional and can be used instead of the `client` and `handler` paths to load a single bundled script.
     * Both relative and absolute paths are accepted. Relative paths are resolved to the current URL
     * @example `/uv/uv.bundle.js`,
     * @defaultValue `/uv.bundle.js`
     */
    bundle?: string;
    /**
     * The path to the UltravioletV2 configuration script.
     * This script should export a configuration object that will be used to configure the client and service worker.
     * Both relative and absolute paths are accepted. Relative paths are resolved to the current URL
     * @example `/uv/uv.config.js`,
     * @defaultValue `/uv.config.js`
     */
    config?: string;
    /**
     * The path to the UltravioletV2 service worker script.
     * This path is optional and can be used instead of the `handler` path to specify a custom service worker script.
     * Both relative and absolute paths are accepted. Relative paths are resolved to the current URL
     * @example `/uv/uv.sw.js`,
     * @defaultValue `/uv.sw.js`
     */
    sw?: string;
    /**
     * The URL encoder.
     * This function will be used to encode URLs before they are sent to the server.
     * The encoder should use `encodeURIComponent` to encode the URLs.
     * @defaultValue `UltravioletV2.codec.xor.encode`
     */
    encodeUrl?: UVv2Encode;
    /**
     * The URL decoder.
     * This function will be used to decode URLs after they are received from the server.
     * The decoder should use `decodeURIComponent` to decode the URLs.
     * @defaultValue `UltravioletV2.codec.xor.decode`
     */
    decodeUrl?: UVv2Decode;

}
