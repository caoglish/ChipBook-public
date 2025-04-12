import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
//import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

	const isProduction = mode === 'production' as const
	return {
		server: {
			host: '0.0.0.0',
			port: 5173
		},
		plugins: [
			vue(),
			vueDevTools(),
			vuetify({ autoImport: true })
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			},
			extensions: ['.js', '.ts', '.vue', '.json'] // ✅ Add .vue here
		},
		base: isProduction ? '/ChipBook' : '',
		assetsInclude: ['**/*.md'],
	}
})
