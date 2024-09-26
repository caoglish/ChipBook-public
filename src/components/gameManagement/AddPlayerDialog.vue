<template>
	<v-dialog v-model="gameStore.addPlayersDialog" max-width="500px">
		<v-card>
			<v-card-title>选择玩家</v-card-title>
			<v-card-text>
				<v-select v-model="gameStore.selectedPlayers" :items="gameStore.ForSelectPlayer"
					item-title="player_name" item-value="id" label="选择一个或多个玩家" chips multiple>
				</v-select>
			</v-card-text>
			<v-card-actions>
				<v-btn color="blue darken-1" @click="gameStore.addPlayersToGame">添加</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.addPlayersDialog = false">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup>
import { useGameStore } from '@/store/useGameStore';
const gameStore = useGameStore();
</script>
