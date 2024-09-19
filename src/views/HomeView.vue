<template>
	<v-row>
		<ContinueGame v-if="isAuthenticated" />
		<envCard v-if="isAuthenticated"/>
		<GoogleLogin />
	</v-row>

	<TodayGameTable v-if="isAuthenticated"/>
</template>

<script lang="ts">
import { defineComponent ,computed} from 'vue';
import GoogleLogin from "@/components/GoogleLogin.vue";
import ContinueGame from "@/components/card/ContinueGameCard.vue";
import envCard from '@/components/card/envCard.vue'
import TodayGameTable from '@/components/TodayGameTable.vue'
import { useLoginUserStore } from "@/store/LoginUserStore";// 导入 Pinia store

export default defineComponent({
	name: 'HomeView',
	setup() {
		const loginUserStore = useLoginUserStore();
		const isAuthenticated= computed(()=>loginUserStore.isAuthenticated);
		return {
			loginUserStore,isAuthenticated
		}
	},
	components: {
		envCard,
		GoogleLogin,
		TodayGameTable,
		ContinueGame,// 注册组件
	},
});
</script>
