<template>
	<div>
		<!-- 添加玩家按钮 -->
		 <v-btn color="primary" @click="openDialog">添加玩家</v-btn><!-- 添加隐藏/显示 ID 列的复选框 --><v-checkbox v-model="showIdColumn" label="显示 ID 列"></v-checkbox>

		  <PlayerTable 
		  title="可选择的玩家列表" 
		  :headers="filteredHeaders" 
		  :items="forSelectPlayers" 
		  icon="minus"
		  @edit-player="editPlayer"
		  @toggle-allow-select="toggleAllowSelect" 
		  @delete-player="confirmDeletePlayer"></PlayerTable>

		  <PlayerTable 
		  title="不允许选择的玩家列表" 
		  :headers="filteredHeaders" 
		  :items="notForSelectPlayers" 
		  icon="plus"
		  @edit-player="editPlayer"
		  @toggle-allow-select="toggleAllowSelect" 
		  @delete-player="confirmDeletePlayer"></PlayerTable>

		<!-- 添加或编辑玩家的对话框 -->
		<v-dialog v-model="dialog" max-width="500px" persistent>
			<v-card>
				<v-card-title>
					<span class="headline">{{ editingPlayer ? '编辑玩家' : '添加玩家' }}</span>
				</v-card-title>
				<v-card-text>
					<v-text-field v-model="player.player_name" label="玩家固定名称" :readonly="editingPlayer"
						:color="editingPlayer ? 'grey' : 'primary'" :dense="editingPlayer" class="readonly-text-field"
						required></v-text-field>
					<v-checkbox v-if="!editingPlayer" v-model="sameName" label="玩家显示名称与玩家固定名称相同"
						@change="syncDisplayName"></v-checkbox>
					<v-text-field v-if="!sameName || editingPlayer" v-model="player.player_display_name" label="玩家显示名称"
						required></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="savePlayer">保存</v-btn>
					<v-btn color="grey darken-1" @click="closeDialog">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- 删除确认对话框 -->
		 <DeleteDialog 
		 v-model="deleteDialog" 
		 :player="confirmedDeletePlayer"
		 ></DeleteDialog>
		
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { usePlayerStore } from "@/store/playerStore";
import PlayerTable from "@/components/PlayerView/PlayerTable";
import DeleteDialog from "@/components/PlayerView/DeleteDialog";
export default defineComponent({
	name: "PlayerPage",
	components: {
		PlayerTable,
		DeleteDialog,
	},
	setup() {
		const playerStore = usePlayerStore(); // 使用 Pinia store
		return {
			playerStore,
		};
	},
	computed: {
		players() {
			return this.playerStore.players;
		},
		forSelectPlayers() {
			return this.playerStore.ForSelectPlayerList;
		},
		notForSelectPlayers() {
			return this.playerStore.NotForSelectPlayerList;
		},
		filteredHeaders() {
            return this.showIdColumn ? this.headers : this.headers.filter(header => header.key !== 'id');
        }
	},
	data() {
		return {
			headers: [
				{ title: "ID", key: "id" },
				{ title: "玩家固定名称", key: "player_name" },
				{ title: "玩家显示名称", key: "player_display_name" },
				{ title: "操作", value: "actions", sortable: false },
			],
			dialog: false,
			deleteDialog: false,
			editingPlayer: false,
			player: { player_name: "", player_display_name: "" },
			sameName: true,
			confirmedDeletePlayer: null,
			showIdColumn: false, // 控制 ID 列显示的状态
		};
	},
	methods: {
		openDialog() {
			this.dialog = true;
			this.editingPlayer = false;
			this.player = { player_name: "", player_display_name: "" };
			this.sameName = true;
		},
		closeDialog() {
			this.dialog = false;
		},
		confirmDeletePlayer(player) {
			this.deleteDialog = true;
			this.confirmedDeletePlayer = player;
		},
		closeDeleteDialog() {
			this.deleteDialog = false;
			this.confirmedDeletePlayer = null;
		},
		syncDisplayName() {
			if (this.sameName) {
				this.player.player_display_name = this.player.player_name;
			}
		},
		editPlayer(item) {
			this.dialog = true;
			this.editingPlayer = true;
			this.player = { ...item };
		},
		async toggleAllowSelect(player){
			this.playerStore.toggleAllowSelect(player.id)
		},

		async savePlayer() {
			if (this.editingPlayer) {
				await this.playerStore.updatePlayer(this.player.id, {
					player_display_name: this.player.player_display_name,
				});
			} else {
				if (this.sameName) {
					this.player.player_display_name = this.player.player_name;
				}
				console.log(this.player);
				await this.playerStore.addPlayer(this.player);
			}
			this.closeDialog();
		},
	},
	created() {
		this.playerStore.fetchPlayers(); // 在组件创建时，从 Firebase 获取玩家数据
	},
});
</script>

<style>
.v-btn {
	margin: 10px;
}

.readonly-text-field .v-input__control {
	color: grey !important;
}
</style>