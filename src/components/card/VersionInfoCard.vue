<template>
	<v-card class="ma-2 pa-6"  variant="outlined" >
	  <h2>版本信息</h2>
	  <div v-html="versionContent"></div>
	</v-card>
  </template>
  
  <script setup>
  import MarkdownIt from 'markdown-it';
  import versionMd from '@/assets/version.md'; // 直接 import
  
  const md = new MarkdownIt();
  const versionContent = md.render(versionMd); // 解析 Markdown 为 HTML
  </script>