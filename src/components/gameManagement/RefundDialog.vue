<template>
	<v-dialog v-model="gameStore.refundDialog" max-width="400px" persistent>

		<v-card>
			<v-card-title>
				玩家退码
				<v-chip color="primary" variant="flat">{{ gameStore.currentPlayer.player_display_name }}</v-chip></v-card-title>
			<v-card-text>
				<v-number-input 
				v-model="gameStore.refundAmount" 
				label="退码手数" 
				controlVariant="split" 
				:min="1"
				inset
				></v-number-input>
			</v-card-text>
			<v-card-actions>
				<v-btn color="blue darken-1" @click="confirmRefund" variant="flat" :disabled="isProcessing">
					<v-progress-circular v-if="isProcessing" indeterminate size="20" class="mr-2"></v-progress-circular>
					确认
				</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.refundDialog = false" variant="outlined">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup>
import { useGameStore } from '@/store/useGameStore';
import { ref, watch } from 'vue';
import {delay } from "@/Lib/Helper.ts";

const isProcessing = ref(false);

const gameStore = useGameStore();
const confirmRefund = async () => {
	console.log('confirmRefund');
	if (isProcessing.value) return; // 防止重复点击
	isProcessing.value = true;
	await gameStore.confirmRefund();
	isProcessing.value = false;
	
	delay(()=>{gameStore.refundAmount = 0});
};

watch(() => gameStore.refundDialog, (newVal) => {
	if (newVal) {
		isProcessing.value = false;
	}
});
</script>