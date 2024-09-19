<template>
	<v-col v-if="!loginUserStore.isAuthenticated" cols="12" md="2">
		<v-row>
			<v-btn v-if="!user" color="primary" @click="signInWithGoogle">使用 Google 登录</v-btn>
		</v-row>
		<v-row>
			<v-alert v-if="loginUserStore.errorMessage" type="error" dismissible @click="clearErrorMessage">{{
				loginUserStore.errorMessage }}</v-alert>
		</v-row>
	</v-col>

	<LoginUserCard v-if="loginUserStore.isAuthenticated"></LoginUserCard>

</template>

<script setup lang="ts">
import { useLoginUserStore } from "@/store/LoginUserStore";
import { computed } from "vue";
import LoginUserCard from '@/components/card/LoginUserCard.vue'

// 使用 Pinia store
const loginUserStore = useLoginUserStore();

// 方法直接调用 store 的 action
const signInWithGoogle = () => {
	loginUserStore.signInWithGoogle();
};

const clearErrorMessage = () => {
	loginUserStore.errorMessage = null;
};

const user = computed(() => loginUserStore.user);
</script>

<style scoped>
.v-btn {
	margin: 10px;
}
</style>