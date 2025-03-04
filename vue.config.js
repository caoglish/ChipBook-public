const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/ChipBook' : "",

  // <---- Here
// 生产环境和开发环境构建配置的不同点
configureWebpack: config => {
	// Define Vue feature flags globally
    config.plugins = (config.plugins || []).concat([
		new webpack.DefinePlugin({
		  '__VUE_OPTIONS_API__': JSON.stringify(true),
		  '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
		  '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),
		})
	  ]);
	  
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置
      config.optimization.minimize = true;
      config.devtool = 'source-map'; // 使用 source-map 以便调试
    } else {
      // 为开发环境修改配置
      config.devtool = 'eval-source-map'; // 使用 eval-source-map 提升开发速度
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('raw')
      .test(/\.md$/) // 处理 .md 文件
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
