<template>
  <v-card variant="outlined">
    <v-card-item>
      <v-card-title class="text-h5"> 当前局信息 </v-card-title>

      <v-card-subtitle> session id: {{ gameStore.currentGame.id }} </v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <p>创建时间: {{ gameStore.currentGame.created_at }}</p>
      <p>一手筹码数: {{ gameStore.currentGame.chips_per_hand }}</p>
      <p>每手金额: {{ gameStore.currentGame.amount_per_hand }}</p>
      <p>创建者: {{ gameStore.gameCreater }}</p>
      <p>
        游戏状态：

        <v-chip :color="getGameStatus.statusColor" variant="flat">
          {{ getGameStatus.statusText }}</v-chip
        >
      </p>
    </v-card-text>
    <!-- 加入玩家按钮 -->
    <v-card-actions>
      <v-col cols="auto" class="mr-auto">
        <v-btn
          color="primary"
          @click="gameStore.openAddPlayersDialog"
          variant="flat"
          prepend-icon="mdi-account-plus"
          >加入玩家</v-btn
        >
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <slot name="btn"></slot>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script setup>
// @ts-ignore
import { useGameStore } from '@/store/useGameStore'
import { computed } from 'vue'
const gameStore = useGameStore()
// const isStarted = computed(() => {
// 	return gameStore.summaryData.total_players > 0;
// });

const getGameStatus = computed(() => {
  console.log(gameStore.getGameStatus)
  return gameStore.getGameStatus
})

// const isgamecompleted = computed(() => {
// 	return gameStore.summaryData.is_game_completed;
// });
</script>
