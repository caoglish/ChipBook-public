<template>
	<div class="about">
		<h1>About</h1>
		<AppVersion />
		<envCard></envCard>
		<LoginUserCard></LoginUserCard>
		<h2>版本信息</h2>
    	<div v-html="versionContent"></div>
	</div>
</template>


<script  setup >
import LoginUserCard from '@/components/card/LoginUserCard.vue'
import envCard from '@/components/card/envCard.vue'
import AppVersion from '@/components/card/AppVersionCard.vue';

import { ref, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import versionMd from '@/assets/version.md'; // 直接 import

const md = new MarkdownIt();
const versionContent = md.render(versionMd); // 解析 Markdown 为 HTML


</script>