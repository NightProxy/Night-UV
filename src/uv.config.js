/*global UltravioletV2*/
self.__uvv2$config = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: UltravioletV2.codec.xor.encode,
    decodeUrl: UltravioletV2.codec.xor.decode,
    handler: '/uv.handler.js',
    client: '/uv.client.js',
    bundle: '/uv.bundle.js',
    config: '/uv.config.js',
    sw: '/uv.sw.js',
};
