<template>
	<v-dialog v-model="gameStore.addPlayersDialog" max-width="500px" persistent>
		<v-card>
			<v-card-title>选择玩家</v-card-title>
			<v-card-text>
				<v-select v-model="selectedPlayers" :items="playerStore.ForSelectPlayerList"
				:item-props="itemProps" item-value="id" label="选择一个或多个玩家" chips multiple>
				</v-select>
			</v-card-text>
			<v-card-actions>
				<v-btn color="blue darken-1" @click="addPlayersToGame" variant="flat">添加</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.addPlayersDialog = false" variant="outlined">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup>
import { useGameStore } from '@/store/useGameStore';
import { usePlayerStore } from '@/store/playerStore';
import { ref, onMounted } from 'vue';
import { debounce } from '@/Lib/Helper';

const gameStore = useGameStore();
const playerStore = usePlayerStore();

const selectedPlayers = ref([]);

const addPlayersToGame = debounce(() => {
    gameStore.addPlayersToGame(selectedPlayers.value,playerStore.ForSelectPlayerList);
});

const itemProps = item=>({
	title:item.player_display_name,
	subtitle:item.player_name
});
onMounted(async () => {
    await playerStore.fetchPlayers();
});
</script>
