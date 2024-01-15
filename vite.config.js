import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite';
import {
  VantResolver
} from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(), Components({
    resolvers: [VantResolver()]
  })],

  server: {
    host: '0.0.0.0'
  },
  define: {
    'process.env': process.env
  }
})