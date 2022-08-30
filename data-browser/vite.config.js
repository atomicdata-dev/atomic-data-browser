import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  references: [{ path: 'lib' }, { path: 'react' }],
  optimizeDeps: {
    // this may help when linking + HMR is not working
    // exclude: ['@tomic/lib', '@tomic/react'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    strictPort: true,
    hmr: {
      // Fixes an issue with HMR
      port: 5174,
    },
  },
  // resolve: {
  //   alias: {
  //     '@tomic/lib': path.resolve(__dirname, 'lib'),
  //     '@tomic/react': path.resolve(__dirname, 'react'),
  //   },
  // },
});
