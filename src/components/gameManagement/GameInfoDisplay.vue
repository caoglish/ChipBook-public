<template>
	<div>
		<h2>当前局信息</h2>
		<p>session id: {{ gameStore.currentGame.id }}</p>
		<p>创建时间: {{ gameStore.currentGame.created_at }}</p>
		<p>一手筹码数: {{ gameStore.currentGame.chips_per_hand }}</p>
		<p>每手金额: {{ gameStore.currentGame.amount_per_hand }}</p>

		<!-- 加入玩家按钮 -->
		<v-btn color="secondary" @click="gameStore.openAddPlayersDialog">加入玩家</v-btn>
	</div>
</template>

<script setup >
import { useGameStore } from '@/store/useGameStore';
const gameStore = useGameStore();

</script>