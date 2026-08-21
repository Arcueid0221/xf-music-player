import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'XfMusicPlayer',
            formats: ['es', 'iife'],
            fileName: (format) =>
                format === 'es' ? 'music-player.esm.js' : 'music-player.min.js',
        },
        sourcemap: true,
        minify: false,
    },
    plugins: [dts({ insertTypesEntry: true })],
})