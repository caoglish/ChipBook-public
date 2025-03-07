<template>
	<div>
		<!-- 添加玩家按钮 -->
		 <v-btn color="primary" @click="openDialog">添加玩家</v-btn><!-- 添加隐藏/显示 ID 列的复选框 -->
		 <v-btn to="/playerSimple"  class="ml-6" color="primary"   prepend-icon="$vuetify"
		 append-icon="$vuetify">快速选择玩家</v-btn>
		 <v-checkbox v-model="showIdColumn" label="显示 ID 列"></v-checkbox>
		 <v-icon icon="fa:fas fa-list"></v-icon>
		 

		  <PlayerTable
		  title="可选择的玩家列表" 
		  :headers="filteredHeaders" 
		  :items="forSelectPlayers" 
		  icon="minus"
		  @edit-player="editPlayer"
		  @toggle-allow-select="toggleAllowSelect" 
		  @delete-player="confirmDeletePlayer"
		  @toggle-star="toggleStar"></PlayerTable>

		  <PlayerTable 
		  title="不允许选择的玩家列表" 
		  :headers="filteredHeaders" 
		  :items="notForSelectPlayers" 
		  icon="plus"
		  @edit-player="editPlayer"
		  @toggle-allow-select="toggleAllowSelect" 
		  @delete-player="confirmDeletePlayer"
		  @toggle-star="toggleStar"></PlayerTable>

		
		<AddDialog
			v-model="dialog"
			v-model:error="addDialogError"
			:player="player"
			:editingPlayer="editingPlayer"
			v-model:sameName="sameName"
			@save="savePlayer"
			@close="closeDialog"
			/>

		<!-- 删除确认对话框 -->
		 <DeleteDialog 
		 v-model="deleteDialog" 
		 :player="confirmedDeletePlayer"
		 ></DeleteDialog>
		
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { usePlayerStore } from "@/store/usePlayerStore";
import PlayerTable from "@/components/PlayerView/PlayerTable";
import DeleteDialog from "@/components/PlayerView/DeleteDialog";
import AddDialog from "@/components/PlayerView/AddDialog.vue";

export default defineComponent({
	name: "PlayerPage",
	components: {
		PlayerTable,
		DeleteDialog,
		AddDialog,
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
			addDialogError:null,
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
			this.playerStore.togglePlayerField(player.id,'allow_select')
		},
		async toggleStar(player){
			this.playerStore.togglePlayerField(player.id,'star')
		},

		async savePlayer() {
			this.addDialogError = null;
			if (this.editingPlayer) {
				await this.playerStore.updatePlayer(this.player.id, {
					player_display_name: this.player.player_display_name,
				});
			} else {
				if (this.sameName) {
					this.player.player_display_name = this.player.player_name;
				}
				try{
					await this.playerStore.addPlayer(this.player);
					
				} catch (error) {
					console.error(error);
					this.addDialogError = error.message;
					return
				}	
				
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
.v-data-table__td .v-btn {
	margin-left: 10px;
}

.readonly-text-field .v-input__control {
	color: grey !important;
}
</style>