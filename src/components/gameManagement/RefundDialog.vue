<template>
	<v-dialog v-model="gameStore.refundDialog" max-width="400px" persistent>

		<v-card>
			<v-card-title>
				
				<div class="text-h6 mb-3 d-md-inline-block">玩家退码：</div>
				<div class="font-weight-black mb-3 d-md-inline-block">{{ gameStore.currentPlayer.player_display_name }}</div></v-card-title>
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
				<v-btn color="blue darken-1" @click="confirmRefund">确认</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.refundDialog = false">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup>
import { useGameStore } from '@/store/useGameStore';
import { debounce } from 'lodash';
const gameStore = useGameStore();
const confirmRefund = debounce(gameStore.confirmRefund, 300);
</script>