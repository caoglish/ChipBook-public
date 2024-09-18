<template>
	<div>
		<v-col cols="12" md="2">
			<v-card class="mt-4" variant="outlined"  title="System Environment">
				<v-card-text>
					<h1 :style="{ color: isDevelopment ? 'green' : 'red' }">{{ env }}</h1>
				</v-card-text>
			</v-card>
		</v-col>
	</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useEnvStore } from "@/store/envStore";

const envStore = useEnvStore();
const env = computed(() => envStore.env ? envStore.env : "");
const isDevelopment = computed(() => env.value == 'Development');

onMounted(async () => {
	await envStore.loadEnv();
});

</script>
