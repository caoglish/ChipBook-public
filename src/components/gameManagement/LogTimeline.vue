<template>
    <div class="game-log">
        <h3>时间线</h3>
        <v-timeline side="end">
            <v-timeline-item dot-color="grey">
                <v-card>
                    <v-card-title :class="`bg-grey-lighten-1`"
                        ><v-icon icon="mdi-cards-spade" />游戏开始 -
                        {{ gameStartTime }}
                    </v-card-title>
                </v-card>
            </v-timeline-item>
            <v-timeline-item
                v-for="item in logs"
                size="small"
                :dot-color="item.color"
            >
                <v-card class="bordered-card">
                    <v-card-title :class="`bg-${item.color}`"
                        ><v-icon>{{ item.icon }}</v-icon
                        >{{ item.actionText }} - {{ item.date }}
                    </v-card-title>
                    <v-card-text>
                        <p class="font-weight-black">
                            <v-icon icon="mdi-account-group"></v-icon>
                            {{ item.player_display_name }}
                        </p>
                        <p></p>
                        <p><v-icon icon="mdi-note"></v-icon> {{ item.note }}</p>
                    </v-card-text>
                </v-card>
            </v-timeline-item>

            <v-timeline-item dot-color="blue-grey-darken-3" v-if="isGameEnd">
                <v-card>
                    <v-card-title :class="`bg-blue-grey-darken-3`"
                        ><v-icon icon="mdi-cards-spade" />游戏结束 -
                        {{ getGameEndTime() }}
                    </v-card-title>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </div>
</template>

<script setup>
import { computed, } from "vue";
import { useLogStore } from "@/store/useLogStore";
import { useGameStore } from "@/store/useGameStore";
import { makeTimelineDetail } from "@/Lib/LogHelper.ts";


const logStore = useLogStore();
const gameStore = useGameStore();

const gameStartTime = gameStore.currentGame?.created_at;
const isGameEnd = computed(() =>gameStore. players.length>0&&gameStore.summaryData?.is_zero);
const logs = computed(() =>
    logStore.combinedLogs.map((x) => makeTimelineDetail(x))
);
logStore.sortLogsByTime();

const getGameEndTime = () => {
    const loglist = logs.value;
    const lastlog = loglist[loglist.length - 1];
    return lastlog?.date;
};

</script>

<style scoped>
.bordered-card {
    border: 1px solid #ccc;
    border-radius: 8px; /* 圆角 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
</style>
