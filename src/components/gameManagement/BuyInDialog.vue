<template>
	<v-dialog v-model="gameStore.buyInDialog" max-width="400px">
		<v-card>
			<v-card-title>玩家买入</v-card-title>
			<v-card-text>
				<v-text-field v-model="gameStore.buyInAmount" label="买入手数" type="number"></v-text-field>
			</v-card-text>
			<v-card-actions>
				<v-btn color="blue darken-1" @click="gameStore.confirmBuyIn">确认</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.buyInDialog = false">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup>
import { useGameStore } from '@/store/useGameStore';
const gameStore = useGameStore(); // 获取 gameStore
</script>