const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	lintOnSave: false,
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/ChipBook' : "",

  // <---- Here
  productionSourceMap: false,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
