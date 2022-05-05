import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  references: [{ path: 'lib' }, { path: 'react' }],
  optimizeDeps: {
    // this may help when linking + HMR is not working
    exclude: ['@tomic/lib', '@tomic/react'],
  },
  // resolve: {
  //   alias: {
  //     '@tomic/lib': path.resolve(__dirname, 'lib'),
  //     '@tomic/react': path.resolve(__dirname, 'react'),
  //   },
  // },
});
