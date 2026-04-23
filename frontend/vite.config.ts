import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = './..'; 
  const env = loadEnv(mode, envDir, '');

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      strictPort: true,
    },
  }
})
