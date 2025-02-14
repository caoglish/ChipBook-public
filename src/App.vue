<template>
	<v-app>
		<v-main>
			<v-container>
				<v-app-bar app color="default" dark>
					<v-toolbar-title>
						Chip Book
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-bottom-navigation color="primary" horizontal v-if="isAuthenticated">
						<v-btn to="/" class="nav-link">Home</v-btn>
						<v-btn to="/game" class="nav-link">Game</v-btn>
						<v-btn to="/history" class="nav-link">History</v-btn>
						<v-btn to="/player" class="nav-link">Player</v-btn>
						<v-btn to="/about" class="nav-link">About</v-btn>
					</v-bottom-navigation>
				</v-app-bar>


			</v-container>
			<v-container>
				<router-view />
			</v-container>

		</v-main>
	</v-app>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useLoginUserStore } from "@/store/LoginUserStore";// 导入 Pinia store

export default defineComponent({
	name: "App",
	setup() {
		const loginUserStore = useLoginUserStore(); // 获取登录用户 store
		const isAuthenticated = computed(() => !!loginUserStore.user);// 计算属性，检查用户是否已登录
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
