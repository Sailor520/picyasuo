import { defineConfig } from 'vite'

export default defineConfig({
  // 开发服务器配置
  server: {
    port: 3000,
    open: true, // 自动打开浏览器
    host: true, // 支持局域网访问
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        contact: 'contact.html',
        privacy: 'privacy.html',
        '404': '404.html'
      },
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 确保静态文件被复制
    copyPublicDir: true
  },
  
  // 静态资源处理
  publicDir: 'public',
  
  // 别名配置（如果需要的话）
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    }
  }
}) 