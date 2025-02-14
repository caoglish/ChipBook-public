<template>
	<div class="game-management">
		<!-- 创建新德州局按钮 -->
		<v-btn color="primary" v-if="!gameStore.currentGame" @click="gameStore.openNewGameDialog">创建新德州局</v-btn>

		<div ref="gameInfo" class="print-container" v-if="gameStore.currentGame">
			<!-- 显示当前局信息 -->
			<GameInfoDisplay />
			<PlayerTable :players="gameStore.players" :isExporting="gameStore.isExporting" />
			<!-- 引入总结表格组件 -->
			<SummaryTable :summaryData="gameStore.summaryData" :isExporting="gameStore.isExporting"
				:gameId="gameStore.currentGame.id" />
			<!-- 日志记录表格 -->
			<LogsTable />
		</div>
		<!-- 打印按钮 -->
		<v-btn v-if="gameStore.currentGame" color="primary" @click="printGameInfo">打印游戏信息</v-btn>

		<!-- 引入创建新德州局对话框 -->
		<CreateNewGameDialog />



		<!-- 引入添加玩家对话框组件 -->
		<AddPlayerDialog />

		 <!-- 引入买入手数对话框组件 -->
		 <BuyInDialog />

		<!-- 引入退码手数对话框组件 -->
		<RefundDialog />

		<!-- 引入剩余筹码对话框组件 -->
		<RemainingChipsDialog />
	</div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import html2canvas from 'html2canvas';

import { useGameStore } from '@/store/useGameStore';
import PlayerTable from '@/components/gameManagement/PlayerTable.vue';
import SummaryTable from '@/components/gameManagement/SummaryTable.vue';
import LogsTable from '@/components/gameManagement/LogsTable.vue';
import GameInfoDisplay from '@/components/gameManagement/GameInfoDisplay.vue';
import CreateNewGameDialog from '@/components/gameManagement/CreateNewGameDialog.vue';
import AddPlayerDialog from '@/components/gameManagement/AddPlayerDialog.vue';
import RefundDialog from '@/components/gameManagement/RefundDialog.vue';
import RemainingChipsDialog from '@/components/gameManagement/RemainingChipsDialog.vue';
import BuyInDialog from '@/components/gameManagement/BuyInDialog.vue';

const gameStore = useGameStore();
const route = useRoute();
const gameInfo = ref(null);

onMounted(async () => {
	const gameId = route.params.gameId || null;
	console.log(gameId)
	if (gameId) {
		await gameStore.selectGame(gameId);
	} else {
		gameStore.currentGame = null;
	}
	
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


.print-container {
	width: 100%;
	overflow: visible;
	/* 确保内容不被裁剪 */
}
</style>