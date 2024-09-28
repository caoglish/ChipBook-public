<template>
	<div>
		<h2>游戏历史记录</h2>

		<!-- 删除成功的提示消息 -->
		<v-alert v-if="historyStore.showDeleteAlert" type="success" dismissible
			@input="historyStore.showDeleteAlert = false" class="my-4">
			游戏记录已成功删除。
		</v-alert>

		<!-- 游戏历史记录表格 -->
		<v-data-table :headers="historyHeaders" :items="historyStore.games" class="mt-4">
			<template #item.actions="{ item }">
				<v-btn color="primary" @click="viewGame(item.id)">查看</v-btn>
				<v-btn color="error" @click="confirmDelete(item)" v-if="item.player_count === 0">删除</v-btn>
			</template>
			<template #item.created_at="{ item }">
				<span>{{ item.created_at }}</span>
			</template>
			<template #item.summary="{ item }">
				<span :style="{ color: item.summary ? 'green' : 'red' }">{{ item.summary ? "有" : "无" }}</span>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { useHistoryStore } from '@/store/useHistoryStore';

export default defineComponent({
	name: 'History',
	computed: {
		historyStore() {
			return useHistoryStore(); // 使用 Pinia store
		},
		historyHeaders() {
			return [
				{ title: '游戏ID', key: 'id' },
				{ title: '创建时间', key: 'created_at' },
				{ title: '玩家数量', key: 'player_count' },
				{ title: '每手筹码', key: 'chips_per_hand' },
				{ title: '每手金额', key: 'amount_per_hand' },
				{ title: '总结', key: 'summary' },
				{ title: '操作', key: 'actions', sortable: false },
			];
		},
	},
	methods: {
		viewGame(gameId) {
			this.$router.push({ name: 'GameManagement', params: { gameId } });
		},
		confirmDelete(game) {
			const confirmation = confirm(`您确定要删除游戏 ${game.id} 吗？此操作不可撤销。`);
			if (confirmation) {
				this.historyStore.deleteGame(game.id);
			}
		},
	},
	created() {
		this.historyStore.fetchAllGames(); // 加载历史记录
	},
});
</script>

<style scoped>
.v-btn {
	margin: 10px;
}
</style>
