<template>
	<div>
		<!-- 总结信息表格 -->
		<v-data-table :headers="headersToShow" :items="[summaryData]" :hide-default-footer="1"
			class="mt-4 summary-table">
			<template #item.is_zero="{ item }">
				<span :style="{ color: item.is_zero ? 'green' : 'red' }">{{ item.is_zero ? '是' : '否' }}</span>
			</template>
			<template #item.game_status="{ item }">
				<span :style="{ color: item.is_game_completed ? 'green' : 'red' }">
					{{ item.is_game_completed ? '游戏结束' : '游戏未结束' }}
				</span>
			</template>
			<!-- 添加保存总结按钮 -->
			<template #item.save_summary="{ item }">
				<v-btn v-if="item.total_players > 0 && item.is_game_completed" color="green darken-1"
					@click="saveSummary">保存总结</v-btn>
			</template>
		</v-data-table>


		<!-- 成功保存的提示框 -->
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
		// 使用 Pinia 的 store
		gameStore() {
			return useGameStore();
		},
		// 动态生成 headers，包括保存总结的列
		headersToShow() {
			const headers = [
				{ title: "总人数", key: "total_players" },
				{ title: "总买入手数", key: "total_hands_bought" },
				{ title: "总买入筹码", key: "total_chips_bought" },
				{ title: "总买入金额", key: "total_amount_bought" },
				{ title: "总剩余筹码", key: "total_remaining_chips" },
				{ title: "总胜负筹码", key: "total_win_loss_chips" },
				{ title: "总胜负金额", key: "total_win_loss_amount" },
				{ title: "胜负筹码为0?", key: "is_zero" },
				{ title: "游戏状态", key: "game_status" },
			];

			// 如果不在导出模式下，添加操作列
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

<style>
/* 添加样式以美化表格和按钮 */
.v-data-table {
	margin-top: 20px;
}

.summary-table .v-table__wrapper td,
.summary-table .v-table__wrapper th {
	border: 1px solid #ddd !important;
	/* 添加边框 */
	padding: 8px;
	/* 增加内边距 */
	text-align: center;
	/* 居中对齐文本 */
	vertical-align: middle;
	/* 垂直居中对齐 */
	background-color: #f9f9f9;
	/* 可选：背景色 */
}
</style>
