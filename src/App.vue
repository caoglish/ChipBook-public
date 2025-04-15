<template>
	
<v-app>
		<!-- 顶部导航栏 -->
		<v-app-bar color="default" dark scroll-behavior="hide">
			<v-toolbar-title>Chip Book</v-toolbar-title>
			<v-spacer></v-spacer>

			<!-- 仅在用户已登录时显示导航按钮 -->
			<template v-if="isAuthenticated">
				<v-btn to="/"  class="nav-link">Home</v-btn>
				<v-btn to="/game"  class="nav-link">Game</v-btn>
				<v-btn to="/history"  class="nav-link">History</v-btn>
				<v-btn to="/player"  class="nav-link">Player</v-btn>
				<v-btn to="/about"  class="nav-link">About</v-btn>
				

			</template>
		</v-app-bar>

		<!-- 主内容区域 -->
		<v-main>
			<v-container>
				<router-view />
			</v-container>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useLoginUserStore } from "@/store/useLoginUserStore";// 导入 Pinia store

export default defineComponent({
	name: "App",
	setup() {
		const loginUserStore = useLoginUserStore(); // 获取登录用户 store
		const isAuthenticated = computed(() => Boolean(loginUserStore.user)); // 计算属性，检查用户是否已登录
		onMounted(() => {
			loginUserStore.checkAuthState(); // 检查用户登录状态
		});
		return {
			isAuthenticated,
			loginUserStore
		};
	},
});
</script>
