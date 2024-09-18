<template>
		<v-col cols="12" md="2">
			<v-card  variant="outlined" title="User Information">
				<v-card-text>
					<p>Name: {{ loginUserStore.user?.displayName || 'Unknown' }}</p>
					<p>Email: {{ loginUserStore.user?.email }}</p>
				</v-card-text>
			</v-card>
		</v-col>
</template>

<script setup>
import { computed } from 'vue'
import { useLoginUserStore } from "@/store/LoginUserStore";// 导入 Pinia store
const loginUserStore = useLoginUserStore();
const isAuthenticated = computed(() => !!loginUserStore.user);
</script>