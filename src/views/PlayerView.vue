<template>
	<div>
		<!-- 添加玩家按钮 -->
		<v-btn color="primary" @click="openDialog">添加玩家</v-btn>

		<!-- 显示玩家列表的表格 -->
		<h3>可选择的玩家列表</h3>
		<v-data-table :headers="headers" :items="forSelectPlayers" :items-per-page="50">
			<!-- 动态生成表格中的操作列 -->
			<template #item.actions="{ item }">
				<v-btn color="primary" icon @click="editPlayer(item)">
					<v-icon>mdi-pencil</v-icon>
				</v-btn>

				<v-btn color="secondary" icon @click="toggleAllowSelect(item.id)">
					<v-icon>mdi-minus</v-icon>
				</v-btn>
				<v-btn color="error" icon @click="confirmDeletePlayer(item.id)">
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</template>
		</v-data-table>

		<!-- 显示不允许选择的玩家列表 -->
		<h3>不允许选择的玩家列表</h3>
		<v-data-table :headers="headers" :items="notForSelectPlayers" :items-per-page="50">
			<template #item.actions="{ item }">
				<v-btn color="primary" icon @click="editPlayer(item)">
					<v-icon>mdi-pencil</v-icon>
				</v-btn>

				<v-btn color="secondary" icon @click="toggleAllowSelect(item.id)">
					<v-icon>mdi-plus</v-icon>
				</v-btn>
				<v-btn color="error" icon @click="confirmDeletePlayer(item.id)">
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
import { defineComponent } from "vue";
import { usePlayerStore } from "@/store/playerStore";

export default defineComponent({
	name: "PlayerPage",
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
			confirmedDeleteId: null,
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
		confirmDeletePlayer(playerId) {
			this.deleteDialog = true;
			this.confirmedDeleteId = playerId;
		},
		closeDeleteDialog() {
			this.deleteDialog = false;
			this.confirmedDeleteId = null;
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
		async toggleAllowSelect(playerId){
			this.playerStore.toggleAllowSelect(playerId)
		},
		async deletePlayer(playerId) {
			await this.playerStore.deletePlayer(playerId);
			this.closeDeleteDialog();
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