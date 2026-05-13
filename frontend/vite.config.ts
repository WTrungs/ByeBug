import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');
  return {
    envDir: '../',
    plugins: [
      react(),
      // babel({ presets: [reactCompilerPreset()] })
    ],

    server: {
      port: parseInt((env.VITE_PORT || process.env.VITE_PORT || '5173') as string),
      strictPort: true,
      host: true,
      watch: {
        usePolling: true,   // Required for Docker on Windows (WSL2 inotify issue)
        interval: 300,      // Poll every 300ms
      },
    },
  }
})
