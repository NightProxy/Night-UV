/*global UltravioletV2*/
self.__uvv2$config = {
    /**
     * The prefix for UVv2 (UltravioletV2) resources.
     * @type {string}
     */
    prefix: '/~/uv/',

    /**
     * The bare path.
     * @type {string}
     */
    bare: '/bare/',

    /**
     * Function to encode URLs using UltravioletV2's XOR codec.
     * @type {function}
     * @param {string} url - The URL to encode.
     * @returns {string} The encoded URL.
     */
    encodeUrl: UltravioletV2.codec.xor.encode,

    /**
     * Function to decode URLs using UltravioletV2's XOR codec.
     * @type {function}
     * @param {string} url - The URL to decode.
     * @returns {string} The decoded URL.
     */
    decodeUrl: UltravioletV2.codec.xor.decode,

    /**
     * The handler path.
     * @type {string}
     */
    handler: '/uv/uv.handler.js',

    /**
     * The client path.
     * @type {string}
     */
    client: '/uv/uv.client.js',

    /**
     * The bundle path.
     * @type {string}
     */
    bundle: '/uv/uv.bundle.js',

    /**
     * The config path.
     * @type {string}
     */
    config: '/uv/uv.config.js',

    /**
     * The service worker path.
     * @type {string}
     */
    sw: '/uv/uv.sw.js',

    /**
     * Function to inject scripts into the doc Head
     * @type {function}
     * @param {URL} url - The URL for the rewrite function.
     * @returns {string} - The script to inject.
     */
    inject: async (url) => {
        if (url.host === 'discord.com') {
            return `
                <script src="https://raw.githubusercontent.com/Vencord/builds/main/browser.js"></script>
                <link rel="stylesheet" href="https://raw.githubusercontent.com/Vencord/builds/main/browser.css">
              `;
        }

        return ``;
    },
};
