<template>
	<ContinueGame />
	<envCard />
	<GoogleLogin />

</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
