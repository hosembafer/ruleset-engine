// vite.config.ts
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const target = process.env.BUILD_TARGET;

export default defineConfig(() => {
  if (target === 'cdn') {
    return {
      build: {
        lib: {
          entry: 'src/index.default.ts',
          name: 'RulesetEngine',
          formats: ['umd', 'iife'],
          fileName: (format) => `index.${format}.js`,
        },
        outDir: 'dist-cdn',
        sourcemap: true,
      },
    };
  }
  return {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'RulesetEngine',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format}.js`,
      },
      outDir: 'dist',
      sourcemap: true,
    },
    plugins: [dts()],
  };
});
