<template>
  <v-dialog v-model="gameStore.addPlayersDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>选择玩家</v-card-title>
      <v-card-text>
        <v-select
          v-model="selectedPlayerIds"
          :items="ForSelectPlayerList"
          :item-props="itemProps"
          item-value="id"
          label="选择一个或多个玩家"
          chips
          multiple
        >
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" @click="addPlayersToGame" variant="flat">添加</v-btn>
        <v-btn color="grey darken-1" @click="gameStore.addPlayersDialog = false" variant="outlined"
          >取消</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
// @ts-ignore
import { useGameStore } from '@/store/useGameStore'
import { usePlayerStore } from '@/store/usePlayerStore'
import { ref, onMounted, computed } from 'vue'
import { debounce } from '@/Lib/Helper'

const gameStore = useGameStore()
const playerStore = usePlayerStore()

const selectedPlayerIds = ref([])

const ForSelectPlayerList = computed(() => {
  const gamePlayerIds = new Set(gameStore.players.map((player) => player.player_id))
  return playerStore.ForSelectPlayerList.filter((player) => !gamePlayerIds.has(player.id))
})

const addPlayersToGame = debounce(() => {
  gameStore.addPlayersToGame(selectedPlayerIds.value, playerStore.ForSelectPlayerList)
  selectedPlayerIds.value = []
})

const itemProps = (item) => ({
  title: item.player_display_name,
  subtitle: item.player_name,
})
onMounted(async () => {
  await playerStore.fetchPlayers()
})
</script>
