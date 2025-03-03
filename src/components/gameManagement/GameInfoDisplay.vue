<template>
	<v-card variant="outlined">
		<v-card-item>
			<v-card-title class="text-h5">
				当前局信息
			</v-card-title>

			<v-card-subtitle>
				session id: {{ gameStore.currentGame.id }}
			</v-card-subtitle>
		</v-card-item>
		<v-card-text>
			<p>创建时间: {{ gameStore.currentGame.created_at }}</p>
			<p>一手筹码数: {{ gameStore.currentGame.chips_per_hand }}</p>
			<p>每手金额: {{ gameStore.currentGame.amount_per_hand }}</p>
			<p>创建者: {{ gameStore.gameCreater }}</p>
			<p>游戏状态：
				<v-chip :color="isgamecompleted ? 'green' : 'red'" variant="flat" v-if="isStarted">
					{{ isgamecompleted ? '游戏结束' : '游戏未结束' }}
				</v-chip>
				<v-chip v-else color="default" variant="flat"> 游戏未开始</v-chip>
			</p>
		</v-card-text>
		<!-- 加入玩家按钮 -->
		<v-card-actions>
			<v-btn color="secondary" @click="gameStore.openAddPlayersDialog" variant="flat">加入玩家</v-btn>
		</v-card-actions>
	</v-card>

</template>

<script setup>
import { useGameStore } from '@/store/useGameStore';
import { computed } from 'vue';
const gameStore = useGameStore();
const isStarted = computed(() => {
	return gameStore.summaryData.total_players > 0;
});

const isgamecompleted = computed(() => {
	return gameStore.summaryData.is_game_completed;
});
</script>