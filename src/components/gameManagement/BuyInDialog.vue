<template>
  <v-dialog v-model="gameStore.buyInDialog" max-width="400px" persistent>
    <v-card>
      <v-card-title>
        玩家买入<v-chip color="primary" variant="flat">{{
          gameStore.currentPlayer.player_display_name
        }}</v-chip>
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
        <v-btn color="blue darken-1" @click="confirmBuyIn" variant="flat" :loading="isProcessing">
          确认
        </v-btn>
        <v-btn color="grey darken-1" @click="gameStore.buyInDialog = false" variant="outlined"
          >取消</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { useGameStore } from '@/store/useGameStore'
import { ref, watch } from 'vue'
import { DEFAULT_BUYIN_AMOUNT } from '@/config/appConstants'
import { delay } from '@/Lib/Helper.ts'

const isProcessing = ref(false)

const gameStore = useGameStore()
const confirmBuyIn = async () => {
  if (isProcessing.value) return // 防止重复点击
  isProcessing.value = true
  await gameStore.confirmBuyIn()
  isProcessing.value = false
  delay(() => {
    gameStore.buyInAmount = DEFAULT_BUYIN_AMOUNT
  })
}

watch(
  () => gameStore.buyInDialog,
  (newVal) => {
    if (newVal) {
      isProcessing.value = false
    }
  },
)
</script>
