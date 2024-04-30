/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/UV/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/UV/handler.js',
    client: '/UV/client.js',
    bundle: '/UV/bundle.js',
    config: '/UV/config.js',
    sw: '/UV/sw-.js',
};
