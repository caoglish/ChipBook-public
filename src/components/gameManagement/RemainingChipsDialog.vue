<template>
	<v-dialog v-model="gameStore.remainingDialog" max-width="400px" persistent>
		<v-card>
			<v-card-title>
				设置剩余筹码
				<v-chip color="primary" variant="flat">{{ gameStore.currentPlayer.player_display_name }}</v-chip>
			</v-card-title>
			<v-card-text>
				<v-number-input 
				v-model="gameStore.remainingAmount" 
				label="剩余筹码数" 
				controlVariant="split" 
				inset
				:min="0"
				></v-number-input>
			</v-card-text>
			<v-card-actions>
				
				<v-btn color="blue darken-1" @click="confirmRemaining" variant="flat" :disabled="isProcessing">
					<v-progress-circular v-if="isProcessing" indeterminate size="20" class="mr-2"></v-progress-circular>
					确认
				</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.cancelRemaining" variant="outlined">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { useGameStore } from '@/store/useGameStore';
import { ref, watch } from 'vue';
const isProcessing = ref(false);

const gameStore = useGameStore();
const confirmRemaining = async () => {
	if (isProcessing.value) return; // 防止重复点击
	isProcessing.value = true;
	await gameStore.confirmRemaining();
	isProcessing.value = false;
};

watch(() => gameStore.remainingDialog, (newVal) => {
	if (newVal) {
		isProcessing.value = false;
	}
});
</script>
