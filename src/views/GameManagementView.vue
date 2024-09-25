<template>
	<div>
		<!-- 创建新德州局按钮 -->
		<v-btn color="primary" @click="gameStore.openNewGameDialog">创建新德州局</v-btn>

   <!-- 引入创建新德州局对话框 -->
   <CreateNewGameDialog />

		<div ref="gameInfo" class="print-container" v-if="gameStore.currentGame">
			<!-- 显示当前局信息 -->
			<GameInfoDisplay />

			<PlayerTable :players="gameStore.players" :isExporting="gameStore.isExporting" @buy-in="gameStore.buyIn"
				@set-remaining="gameStore.setRemaining" @refund="gameStore.refund" />

			<!-- 引入总结表格组件 -->
			<SummaryTable :summaryData="gameStore.summaryData" :isExporting="gameStore.isExporting"
				:gameId="gameStore.currentGame.id" />

			<!-- 日志记录表格 -->
			<LogsTable />
		</div>

		<!-- 打印按钮 -->
		<v-btn v-if="gameStore.currentGame" color="primary" @click="printGameInfo">打印游戏信息</v-btn>

		<!-- 添加玩家对话框 -->
		<v-dialog v-model="gameStore.addPlayersDialog" max-width="500px">
			<v-card>
				<v-card-title>选择玩家</v-card-title>
				<v-card-text>
					<v-select v-model="gameStore.selectedPlayers" :items="gameStore.ForSelectPlayer"
						item-title="player_name" item-value="id" label="选择一个或多个玩家" chips multiple></v-select>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="gameStore.addPlayersToGame">添加</v-btn>
					<v-btn color="grey darken-1" @click="gameStore.addPlayersDialog = false">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- 买入手数对话框 -->
		<v-dialog v-model="gameStore.buyInDialog" max-width="400px">
			<v-card>
				<v-card-title>玩家买入</v-card-title>
				<v-card-text>
					<v-text-field v-model="gameStore.buyInAmount" label="买入手数" type="number"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="gameStore.confirmBuyIn">确认</v-btn>
					<v-btn color="grey darken-1" @click="gameStore.buyInDialog = false">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- 退码手数对话框 -->
		<v-dialog v-model="gameStore.refundDialog" max-width="400px">
			<v-card>
				<v-card-title>玩家退码</v-card-title>
				<v-card-text>
					<v-text-field v-model="gameStore.refundAmount" label="退码手数" type="number"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="gameStore.confirmRefund">确认</v-btn>
					<v-btn color="grey darken-1" @click="gameStore.refundDialog = false">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- 剩余筹码对话框 -->
		<v-dialog v-model="gameStore.remainingDialog" max-width="400px">
			<v-card>
				<v-card-title>设置剩余筹码</v-card-title>
				<v-card-text>
					<v-text-field v-model="gameStore.remainingAmount" label="剩余筹码数" type="number"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="gameStore.confirmRemaining">确认</v-btn>
					<v-btn color="grey darken-1" @click="gameStore.cancelRemaining">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup>
import { onMounted, ref,nextTick } from 'vue';
import { useRoute } from 'vue-router';
import html2canvas from 'html2canvas';

import { useGameStore } from '@/store/useGameStore';
import PlayerTable from '@/components/gameManagement/PlayerTable.vue';
import SummaryTable from '@/components/gameManagement/SummaryTable.vue';
import LogsTable from '@/components/gameManagement/LogsTable.vue';
import GameInfoDisplay from '@/components/gameManagement/GameInfoDisplay.vue';
import CreateNewGameDialog from '@/components/gameManagement/CreateNewGameDialog.vue';

const gameStore = useGameStore();
const route = useRoute();
const gameInfo = ref(null);

onMounted(async () => {
	const gameId = route.params.gameId || null;
	console.log(gameId)
	if (gameId) {
		await gameStore.selectGame(gameId);
	}
	await gameStore.fetchPlayers();
});

const printGameInfo = async () => {
	const gameInfoElement = gameInfo.value;
	const buttons = document.querySelectorAll('button, .v-btn');
	buttons.forEach((button) => (button.style.visibility = 'hidden'));
	gameStore.isExporting = true;
	await nextTick();

	if (gameInfoElement) {
		try {
			const canvas = await html2canvas(gameInfoElement, {
				scrollX: 0,
				scrollY: 0,
				windowWidth: document.documentElement.clientWidth,
				windowHeight: document.documentElement.scrollHeight,
			});
			const imgData = canvas.toDataURL('image/png');

			const printWindow = window.open('', '_blank');
			printWindow.document.write(`<img src="${imgData}" />`);
			printWindow.document.close();
		} catch (error) {
			console.error('Error generating image:', error);
			alert('无法生成游戏信息的图片，请重试。');
		} finally {
			buttons.forEach((button) => (button.style.visibility = 'visible'));
			gameStore.isExporting = false;
		}
	}
};
</script>

<style>
.v-btn {
	margin: 10px;
}

.print-container {
	width: 100%;
	overflow: visible;
	/* 确保内容不被裁剪 */
}
</style>