<template>
    <div class="game-management">
        <ProgressBar v-if="isLoading" />
        <!-- 创建新德州局按钮 -->
        <v-btn
            color="primary"
            v-else-if="!gameStore.currentGame && !isLoading"
            @click="gameStore.openNewGameDialog"
            >创建新德州局</v-btn
        >

        <div
            ref="gameInfo"
            class="print-container"
            v-else-if="gameStore.currentGame && !isLoading"
        >
            <!-- 显示当前局信息 -->

            <v-row>
                <v-col cols="12" md="8">
				
                    <GameInfoDisplay>
                        <template v-slot:btn>
							<v-btn color="cyan-darken-1" @click="reportList()"  size="small" icon  variant="flat" ><v-icon>mdi-microphone</v-icon></v-btn>
							<v-btn
                                    color="blue-grey-darken-1"
                                    @click="refreshGame"
                                    variant="flat"
                                    prepend-icon="mdi-database-refresh"
                                    append-icon="mdi-database-refresh"
									class="ml-4 "
                                    >刷新数据</v-btn
                                >

							
  						</template>
                    </GameInfoDisplay>
                </v-col>
            </v-row>

            <PlayerTable
                :players="gameStore.players"
                :isExporting="gameStore.isExporting"
            />
            <!-- 引入总结表格组件 -->
            <SummaryTable
                :summaryData="gameStore.summaryData"
                :isExporting="gameStore.isExporting"
                :gameId="gameStore.currentGame.id"
            />
            <v-divider
                :thickness="4"
                class="border-opacity-75 mt-10"
            ></v-divider>

            <!-- 日志记录表格 -->
            <v-switch
                v-model="showTimeline"
                label="切换视图"
                class="font-weight-black text-h4"
            ></v-switch>

            <LogTimeline v-if="showTimeline" />
            <LogsTable v-else />
            <!-- 打印按钮 -->
            <v-btn
                v-if="gameStore.currentGame"
                color="primary"
                @click="printGameInfo"
                >打印游戏信息</v-btn
            >
        </div>

        <br />
        <br />
        <br />
        <br />

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
import { onMounted, ref, nextTick } from "vue";
import { useRoute } from "vue-router";
import html2canvas from "html2canvas";

import { useGameStore } from "@/store/useGameStore";
import PlayerTable from "@/components/gameManagement/PlayerTable.vue";
import SummaryTable from "@/components/gameManagement/SummaryTable.vue";
import LogsTable from "@/components/gameManagement/LogsTable.vue";
import LogTimeline from "@/components/gameManagement/LogTimeline.vue";
import GameInfoDisplay from "@/components/gameManagement/GameInfoDisplay.vue";
import CreateNewGameDialog from "@/components/gameManagement/CreateNewGameDialog.vue";
import AddPlayerDialog from "@/components/gameManagement/AddPlayerDialog.vue";
import RefundDialog from "@/components/gameManagement/RefundDialog.vue";
import RemainingChipsDialog from "@/components/gameManagement/RemainingChipsDialog.vue";
import BuyInDialog from "@/components/gameManagement/BuyInDialog.vue";
import ProgressBar from "@/components/common/ProgressBar";
import { voiceReportList } from "@/composables/useVoiceReport";

const gameStore = useGameStore();
const route = useRoute();
const gameInfo = ref(null);
const showTimeline = ref(true);
const isLoading = ref(false);

onMounted(async () => {
    const gameId = route.params.gameId || null;
    console.log(gameId);
    if (gameId) {
        isLoading.value = true;
        await gameStore.selectGame(gameId);
        isLoading.value = false;
    } else {
        gameStore.currentGame = null;
    }
});

const refreshGame = async () => {
    isLoading.value = true;
    await gameStore.refreshGame();
    isLoading.value = false;
};

const printGameInfo = async () => {
    const gameInfoElement = gameInfo.value;
    const buttons = document.querySelectorAll("button, .v-btn");
    buttons.forEach((button) => (button.style.visibility = "hidden"));
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
            const imgData = canvas.toDataURL("image/png");

            const printWindow = window.open("", "_blank");
            printWindow.document.write(`<img src="${imgData}" />`);
            printWindow.document.close();
        } catch (error) {
            console.error("Error generating image:", error);
            alert("无法生成游戏信息的图片，请重试。");
        } finally {
            buttons.forEach((button) => (button.style.visibility = "visible"));
            gameStore.isExporting = false;
        }
    }
};

const reportList=()=>{
	
	voiceReportList(gameStore.players)
}

</script>

<style>
.print-container {
    width: 100%;
    overflow: visible;
    /* 确保内容不被裁剪 */
}
</style>
