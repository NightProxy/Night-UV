self.__uv$config = {
    prefix: '/@/light/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/@/handler.js',
    client: '/@/client.js',
    bundle: '/@/bundle.js',
    config: '/@/config.js',
    sw: '/@/sw-.js',
    inject: async (url) => {
        if (url.host === 'discord.com') {
            return `
                <script src="https://raw.githubusercontent.com/Vencord/builds/main/browser.js"></script>
                <link rel="stylesheet" href="https://raw.githubusercontent.com/Vencord/builds/main/browser.css">
              `;
        } else {
            return ``;
        }
    },
};
