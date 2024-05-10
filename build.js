import { rimraf } from 'rimraf';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { build } from 'esbuild';

// read version from package.json
const pkg = JSON.parse(await readFile('package.json'));
process.env.ULTRAVIOLET_VERSION = pkg.version;

const isMinified = process.argv.includes('--min');

await rimraf('@');
await mkdir('@');

// don't compile these files
await copyFile('src/sw.js', '@/sw.js');
await copyFile('src/config.js', '@/config.js');
await copyFile('src/style/style.css', '@/style/style.css');
await copyFile('src/style/bg.jpg', '@/style/bg.jpg');


await build({
    platform: 'browser',
    sourcemap: true,
    minify: isMinified,
    entryPoints: {
        'bundle': './src/rewrite/index.js',
        'client': './src/client/index.js',
        'handler': './src/handler.js',
        'sw': './src/sw-.js',
    },
    define: {
        'process.env.ULTRAVIOLET_VERSION': JSON.stringify(
            process.env.ULTRAVIOLET_VERSION
        ),
    },
    bundle: true,
    outdir: '@/',
});
