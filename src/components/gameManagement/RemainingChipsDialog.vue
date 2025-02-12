<template>
	<v-dialog v-model="gameStore.remainingDialog" max-width="400px" persistent>
		<v-card>
			<v-card-title>
				<div class="text-h6 mb-3 d-md-inline-block">设置剩余筹码：</div>
				<div class="font-weight-black mb-3 d-md-inline-block">{{ gameStore.currentPlayer.player_display_name }}</div>
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
				<v-btn color="blue darken-1" @click="confirmRemaining">确认</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.cancelRemaining">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { useGameStore } from '@/store/useGameStore';
import { debounce } from '@/Lib/Helper';
const gameStore = useGameStore();
const confirmRemaining = debounce(gameStore.confirmRemaining);
</script>
