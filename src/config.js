/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/@/service/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/@/handler.js',
    client: '/@/client.js',
    bundle: '/@/bundle.js',
    config: '/@/config.js',
    sw: '/@/sw-.js',
};