<template>
<ContinueGame/>
	<!-- 使用 GoogleLogin 组件 -->
	<GoogleLogin />


	<envCard/>
	
	
	
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components

import GoogleLogin from "@/components/GoogleLogin.vue";
import ContinueGame from "@/components/ContinueGame.vue";
import envCard from '@/components/envCard.vue'

export default defineComponent({
	name: 'HomeView',

	components: {

		envCard,
		GoogleLogin, 
		ContinueGame,// 注册组件
		
	},
});
</script>
