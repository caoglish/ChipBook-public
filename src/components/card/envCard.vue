<template>
	<v-col v-if="loginUserStore.isAuthenticated" cols="12" md="2">
		<v-card variant="outlined" title="System Environment">
			<v-card-text>
				<h1 :style="{ color: isDevelopment ? 'green' : 'red' }">{{ env }}</h1>
			</v-card-text>
		</v-card>
	</v-col>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useEnvStore } from "@/store/envStore";

import { useLoginUserStore } from "@/store/useLoginUserStore";// 导入 Pinia store
const loginUserStore = useLoginUserStore();


const envStore = useEnvStore();
const env = computed(() => envStore.env ? envStore.env : "");
const isDevelopment = computed(() => env.value == 'Development');

onMounted(async () => {
	
	if(loginUserStore.isAuthenticated){
		await envStore.loadEnv();
	}
});

</script>
