<template>
	<v-dialog v-model="gameStore.buyInDialog" max-width="400px" persistent>
		<v-card>
			<v-card-title>
				玩家买入<v-chip color="primary" variant="flat">{{ gameStore.currentPlayer.player_display_name }}</v-chip>
			</v-card-title>
			<v-card-text>
				

				<v-number-input 
				v-model="gameStore.buyInAmount" 
				label="买入手数" 
				controlVariant="split" 
				:min="1"
				inset
				></v-number-input>
			</v-card-text>
			<v-card-actions>
				<v-btn color="blue darken-1" @click="confirmBuyIn"  variant="flat">确认</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.buyInDialog = false" variant="outlined">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup>
import { useGameStore } from '@/store/useGameStore';
import { debounce } from '@/Lib/Helper';

const gameStore = useGameStore(); // 获取 gameStore
const confirmBuyIn = debounce(gameStore.confirmBuyIn);



</script>

<style>
.v-number-input__control{
	align-items:center;
}
</style>