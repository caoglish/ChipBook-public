//import './assets/main.css'

import { createApp } from 'vue'
import store from './store'

import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'


loadFonts()
createApp(App)
	.use(store)
	.use(router)

	.use(vuetify)
	.mount('#app')
