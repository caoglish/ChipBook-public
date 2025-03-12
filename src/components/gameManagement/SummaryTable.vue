<template>
	<div class="summary-table">
		<v-data-table :headers="headersToShow" :items="[summaryData]" :hide-default-footer="true"
			class="mt-4">
			<template #item.is_zero="{ item }">
				
				<v-chip :color="item.is_zero ? 'green-darken-3' : 'red'" dark variant="flat" v-if="isStarted">{{ item.is_zero ? '是' : '否' }}</v-chip>
			</template>
			
			<!-- 添加保存总结按钮 -->
			<template #item.save_summary="{ item }">
				<v-btn v-if="item.total_players > 0 && item.is_game_completed" color="primary" 
					@click="saveSummary">保存总结</v-btn>
			</template>
		</v-data-table>
		<v-alert v-if="gameStore.showAlert" type="success" class="mt-2">
			总结保存成功！
		</v-alert>
	</div>
</template>
<script>
import { useGameStore } from '@/store/useGameStore';
export default {
	name: "SummaryTable",
	props: {
		summaryData: {
			type: Object,
			required: true,
		},
		gameId: {
			type: String,
			required: true,
		},
		isExporting: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		gameStore() {
			return useGameStore();
		},
		isStarted() {
			return this.summaryData.total_players > 0;
		},
		headersToShow() {
			const headers = [
				{ title: "总人数", key: "total_players" },
				{ title: "总买入手数", key: "total_hands_bought" },
				{ title: "总买入筹码", key: "total_chips_bought" },
				{ title: "总买入金额", key: "total_amount_bought" },
				{ title: "总剩余筹码", key: "total_remaining_chips" },
				{ title: "总收益筹码", key: "total_win_loss_chips" },
				{ title: "总收益金额", key: "total_win_loss_amount" },
				{ title: "收益筹码为0?", key: "is_zero" },
				
			];
			if (!this.isExporting) {
				headers.push({ title: "保存总结", key: "save_summary", sortable: false });// 添加保存总结列
			}
			return headers;
		}
	},
	methods: {
		saveSummary() {
			this.gameStore.saveSummary(this.gameId, this.summaryData);
		},
	},
};
</script>
<style scoped>
.v-data-table {
	margin-top: 20px;
}

.summary-table :deep(thead > tr > th) {
	color: black;
	border: 1px solid #999;
	background-color: #e0e0e0;
	font-weight: bold;
	font-size: 16px;
	/* 移除多余分号 */
}

.summary-table :deep(td) {	border: 1px solid #ddd !important;
	padding: 8px;
	text-align: center;
	vertical-align: middle;
	background-color: #f9f9f9;
}
</style>
