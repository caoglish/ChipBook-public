<template>
	<div class="game-log">
		<h3>日志记录</h3>
		<v-btn color="primary" @click="sortLogsByPlayer">按玩家排序</v-btn>
		<v-btn color="secondary" @click="sortLogsByTime">按时间排序</v-btn>
		<v-data-table :headers="logHeaders" :items="logs" :items-per-page="-1" class="mt-4" />
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useLogStore } from '@/store/useLogStore';

const logStore = useLogStore();
const logs = computed(() => logStore.combinedLogs);

const logHeaders = [
	{ title: '时间', key: 'date' },
	{ title: '玩家名称', key: 'player_display_name' },
	{ title: '操作类型', key: 'action' },
	{ title: '详细信息', key: 'details' }
];

const sortLogsByPlayer = () => {
	logStore.sortLogsByPlayer();
};

const sortLogsByTime = () => {
	logStore.sortLogsByTime();
};
</script>

<style scoped>
.game-log .v-btn {
	margin-left: 10px;
}

</style>