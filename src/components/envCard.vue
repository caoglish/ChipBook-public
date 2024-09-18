<template>
	<div>
		<v-col cols="12" md="2">
			<v-card class="mt-4" outlined>
				<v-card-title>System Environment</v-card-title>
				<v-card-text>
				
	
					<h1 :style="{ color: env == 'Development' ? 'green' : 'red' }">{{ env }}</h1>
				</v-card-text>
			</v-card>
		</v-col>
	</div>
</template>

<script setup>
import { computed ,onMounted} from "vue";
import { useEnvStore } from "@/store/envStore";

const envStore = useEnvStore();
const env = computed(() => envStore.env);

onMounted(async () => {
   await envStore.loadEnv();
 });

</script>

