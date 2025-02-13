<template>
  <!-- 删除确认对话框 -->
  <v-dialog v-model="isOpen" max-width="400px" persistent>
    <v-card>
      <v-card-title class="headline">确认删除</v-card-title>
      <v-card-text
        >您确定要删除
        <span class="d-inline pa-2 bg-black" v-if="player">{{
          player.player_display_name
        }}</span>
        吗？此操作无法撤销。</v-card-text
      >
      <v-card-actions>
        <v-btn color="red darken-1" @click="deletePlayer(player)">确认</v-btn>
        <v-btn color="grey darken-1" @click="closeDeleteDialog">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
//example of recieving prop 'player' and use store in the component to process the 'player' object
import { usePlayerStore } from "@/store/playerStore";
const playerStore = usePlayerStore(); // 使用 Pinia store
const isOpen = defineModel();
const props = defineProps({
  player: Object, // 需要传入的玩家对象
});

const deletePlayer = async (player) => {
  if (props.player) {
    await playerStore.deletePlayer(player.id);
    closeDeleteDialog();
  }
};

const closeDeleteDialog = () => {
  isOpen.value = false;
};
</script>
