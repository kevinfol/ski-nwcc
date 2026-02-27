import { defineConfig } from 'vite';
import { AssetPack } from '@assetpack/core';
import { pixiPipes } from '@assetpack/core/pixi';

function assetPackPlugin() {
    let mode;
    let ap = undefined
    const apConfig = {
        entry: './raw_assets',
        pipes: [
            ...pixiPipes({ manifest: { output: './src/manifest.json' } })
        ]
    }
    return {
        name: 'asset-pack-plugin',
        configResolved(resolvedConfig) {
            mode = resolvedConfig.command;
            if (!resolvedConfig.publicDir) return;
            if (apConfig.output) return;
            const publicDir = resolvedConfig.publicDir.replace(process.cwd(), '');
            apConfig.output = `${publicDir}/`;

        },
        buildStart: async () => {
            if (mode === 'serve') {
                if (ap) return;
                ap = new AssetPack(apConfig);
                ap.watch();
            } else {
                await new AssetPack(apConfig).run();
            }
        },
        buildEnd: async () => {
            if (ap) {
                await ap.stop();
                ap = undefined;
            }
        }
    }
}

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({

    /**
     * @see https://vitejs.dev/guide/api-plugin.html
     */
    plugins: [assetPackPlugin()],

    /**
     * @see https://vitejs.dev/config/build-options.html
     */
    build: {
        outDir: 'dist',
    },
    publicDir: 'public',
})
