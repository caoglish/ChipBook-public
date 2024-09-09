<template>
  <div>
    <!-- 添加玩家按钮 -->
    <v-btn color="primary" @click="openDialog">添加玩家</v-btn>

    <!-- 显示玩家列表的表格 -->
    <v-data-table :headers="headers" :items="players">
      <!-- 动态生成表格中的操作列 -->
      <template #item.actions="{ item }">
        <v-btn icon @click="editPlayer(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="confirmDeletePlayer(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- 添加或编辑玩家的对话框 -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editingPlayer ? '编辑玩家' : '添加玩家' }}</span>
        </v-card-title>
        <v-card-text>
          <!-- 玩家名称输入框（只读模式用于编辑） -->
          <v-text-field 
            v-model="player.player_name" 
            label="玩家固定名称" 
            :readonly="editingPlayer"
            :color="editingPlayer ? 'grey' : 'primary'"
            :dense="editingPlayer"
            class="readonly-text-field"
            required
          ></v-text-field>
          
          <!-- 复选框：使玩家显示名称与玩家名称相同 -->
          <v-checkbox
            v-if="!editingPlayer"
            v-model="sameName"
            label="玩家显示名称与玩家固定名称相同"
            @change="syncDisplayName"
          ></v-checkbox>

          <!-- 玩家显示名称输入框（当sameName为false时显示） -->
          <v-text-field 
            v-if="!sameName||editingPlayer"
            v-model="player.player_display_name" 
            label="玩家显示名称" 
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <!-- 保存和取消按钮 -->
          <v-btn color="blue darken-1" @click="savePlayer">保存</v-btn>
          <v-btn color="grey darken-1" @click="closeDialog">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">确认删除</v-card-title>
        <v-card-text>您确定要删除这个玩家吗？此操作无法撤销。</v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" @click="deletePlayer(confirmedDeleteId)">确认</v-btn>
          <v-btn color="grey darken-1" @click="closeDeleteDialog">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import firebaseDb from "@/Lib/FirebaseDb";

const db = firebaseDb;

export default defineComponent({
  name: "PlayerPage",
  data() {
    return {
      headers: [
        { title: 'ID', key: 'id' },
        { title: '玩家固定名称', key: 'player_name' },
        { title: '玩家显示名称', key: 'player_display_name' },
        { title: '操作', value: 'actions', sortable: false },
      ],
      players: [], // 存储玩家列表
      dialog: false, // 控制添加或编辑对话框的显示
      deleteDialog: false, // 控制删除确认对话框的显示
      editingPlayer: false, // 标识是否正在编辑玩家
      player: { player_name: '', player_display_name: '' }, // 当前编辑或添加的玩家对象
      sameName: true, // 默认情况下为true，玩家显示名称与玩家固定名称相同
      confirmedDeleteId: null, // 存储即将删除的玩家ID
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.editingPlayer = false;
      this.player = { player_name: '', player_display_name: '' };
      this.sameName = true; // 重置复选框状态，默认选中
    },
    closeDialog() {
      this.dialog = false;
    },
    confirmDeletePlayer(playerId) {
      this.deleteDialog = true;
      this.confirmedDeleteId = playerId;
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
      this.confirmedDeleteId = null;
    },
    syncDisplayName() {
      // 如果复选框被勾选，则同步玩家显示名称
      if (this.sameName) {
        this.player.player_display_name = this.player.player_name;
      }
    },
    async fetchPlayers() {
      const playersCol = collection(db, 'players');
      const playerSnapshot = await getDocs(playersCol);
      this.players = playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    editPlayer(item) {
      this.dialog = true;
      this.editingPlayer = true;
      this.player = { ...item };
    },
    async deletePlayer(playerId) {
      const playerRef = doc(db, 'players', playerId);
      await deleteDoc(playerRef);
      this.closeDeleteDialog();
      this.fetchPlayers();
    },
    async savePlayer() {
      const playersCol = collection(db, 'players');
      if (this.editingPlayer) {
        const playerRef = doc(db, 'players', this.player.id);
        await updateDoc(playerRef, { player_display_name: this.player.player_display_name });
      } else {
        // 在保存新玩家时，如果复选框被勾选，则使显示名称与玩家固定名称相同
        if (this.sameName) {
          this.player.player_display_name = this.player.player_name;
        }
        const newPlayer = {
          player_name: this.player.player_name,
          player_display_name: this.player.player_display_name,
        };
        await addDoc(playersCol, newPlayer);
      }
      this.closeDialog();
      this.fetchPlayers();
    },
  },
  created() {
    this.fetchPlayers();
  },
});
</script>

<style>
.v-btn {
  margin: 10px;
}
.readonly-text-field .v-input__control {
  color: grey !important; /* 设置文字颜色为灰色 */
}
</style>
