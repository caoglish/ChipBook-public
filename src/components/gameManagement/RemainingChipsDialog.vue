<template>
	<v-dialog v-model="gameStore.remainingDialog" max-width="400px">
		<v-card>
			<v-card-title>设置剩余筹码</v-card-title>
			<v-card-text>
				<v-text-field v-model="gameStore.remainingAmount" label="剩余筹码数" type="number"></v-text-field>
			</v-card-text>
			<v-card-actions>
				<v-btn color="blue darken-1" @click="gameStore.confirmRemaining">确认</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.cancelRemaining">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { useGameStore } from '@/store/useGameStore';
const gameStore = useGameStore();
</script>
