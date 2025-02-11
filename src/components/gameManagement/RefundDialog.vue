<template>
	<v-dialog v-model="gameStore.refundDialog" max-width="400px">
		<v-card>
			<v-card-title>玩家退码</v-card-title>
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
				<v-btn color="blue darken-1" @click="gameStore.confirmRefund">确认</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.refundDialog = false">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup>
import { useGameStore } from '@/store/useGameStore';
const gameStore = useGameStore();
</script>