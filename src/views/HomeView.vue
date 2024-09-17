<template>
	<hello-world />
	<!-- 使用 GoogleLogin 组件 -->
	<GoogleLogin />

	<ContinueGame/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import HelloWorld from '@/components/HelloWorld.vue';
import GoogleLogin from "@/components/GoogleLogin.vue";
import ContinueGame from "@/components/ContinueGame.vue";

export default defineComponent({
	name: 'HomeView',

	components: {
		HelloWorld,
		GoogleLogin, 
		ContinueGame,// 注册组件
	},
});
</script>
