<template>
	<h2>当天的游戏进程</h2>
	<v-data-table :headers="headers" :items="games" class="mt-4">
		<template #item.actions="{ item }">
			<v-btn color="primary" @click="selectGame(item.id)">继续记录</v-btn>
		</template>
	</v-data-table>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useGameStore } from "@/store/TodayGameStore"; // 引入 Pinia store
import { useRouter } from 'vue-router'; // 引入 useRouter

const router = useRouter(); // 获取 router 实例
const gameStore = useGameStore();
onMounted(() => {
	gameStore.fetchTodayGames();
});

const headers = [
	{ title: "游戏ID", key: "id" },
	{ title: "创建时间", key: "created_at" },
	{ title: "操作", key: "actions", sortable: false }
];

const games = computed(() => gameStore.games); // 从 store 中获取游戏数据
const selectGame = (gameId) => {
	router.push({ name: 'GameManagement', params: { gameId } });
};
</script>