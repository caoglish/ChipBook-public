<template>
  <v-dialog v-model="gameStore.newGameDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>创建新德州局</v-card-title>
      <v-card-text>
        <!-- 输入每手筹码数 -->
        <v-select
          v-model="gameStore.chipsPerHand"
          :items="gameStore.chipsPerHandOptions"
          label="每手筹码数"
          clearable
        />

        <v-number-input
          v-model="gameStore.chipsPerHandCustom"
          label="自定义每手筹码数"
          controlVariant="split"
          inset
          :min="0"
          :step="100"
          v-if="gameStore.chipsPerHand === 'custom'"
        ></v-number-input>

        <!-- 输入每手金额 -->
        <v-select
          v-model="gameStore.amountPerHand"
          :items="gameStore.amountPerHandOptions"
          label="每手金额"
          clearable
        />

        <v-number-input
          v-model="gameStore.amountPerHandCustom"
          label="自定义每手金额"
          controlVariant="split"
          inset
          :min="0"
          :step="10"
          v-if="gameStore.amountPerHand === 'custom'"
        ></v-number-input>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" @click="createNewGame" variant="flat">创建</v-btn>
        <v-btn color="grey darken-1" @click="gameStore.closeNewGameDialog" variant="outlined"
          >取消</v-btn
        > </v-card-actions
      >.
    </v-card>
  </v-dialog>
</template>

<script setup>
// @ts-ignore
import { useGameStore } from '@/store/useGameStore' // 引入使用的 Pinia store
import { debounce } from '@/Lib/Helper'
const gameStore = useGameStore() // 直接返回 gameStore
const createNewGame = debounce(gameStore.createNewGame)
</script>
