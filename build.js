import { rimraf } from 'rimraf';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { build } from 'esbuild';

// read version from package.json
const pkg = JSON.parse(await readFile('package.json'));
process.env.ULTRAVIOLET_VERSION = pkg.version;

const isDevelopment = process.argv.includes('--min');

await rimraf('UV/@');
await mkdir('UV/@');

// don't compile these files
await copyFile('src/sw.js', 'UV/@/sw.js');
await copyFile('src/uv.config.js', 'UV/@/config.js');

await build({
    platform: 'browser',
    sourcemap: true,
    minify: isDevelopment,
    entryPoints: {
        'bundle': './src/rewrite/index.js',
        'client': './src/client/index.js',
        'handler': './src/handler.js',
        'sw-': './src/sw-.js',
    },
    define: {
        'process.env.ULTRAVIOLET_VERSION': JSON.stringify(
            process.env.ULTRAVIOLET_VERSION
        ),
    },
    bundle: true,
    logLevel: 'info',
    outdir: 'UV/',
});
