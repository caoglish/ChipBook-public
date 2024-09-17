<template>
	<div>
		<v-col cols="12" md="2">
			<v-card class="mt-4" outlined>
				<v-card-title>Current Game</v-card-title>
				<v-card-text>
					<p>{{ gameId }}</p>
				</v-card-text>
				<v-alert v-if="noGameSession" type="warning" dismissible>
					没有进行的游戏。
				</v-alert>
				<template v-slot:actions>
					<v-btn v-if="gameId !== null" color="primary" @click="continueGame" variant="outlined">继续进行游戏</v-btn>
				</template>
			</v-card>
		</v-col>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useGameSessionStore } from '@/store/GameSessionStore';
import { useRouter } from 'vue-router'; // 引入 useRouter

export default defineComponent({
	name: 'ContinueGame',
	setup() {
		const gameSessionStore = useGameSessionStore(); // 使用 store
		const router = useRouter(); // 获取 router 实例
		const noGameSession = ref(false); // 控制显示“没有进行的游戏”警告

		const continueGame = async () => {
			const gameId = gameSessionStore.currentGameId;
			if (gameId) {
				const sessionExists = await gameSessionStore.checkGameSessionInFirebase();
				if (sessionExists) {
					// 如果游戏存在，导航到 GameManagement 页面
					router.push({ name: 'GameManagement', params: { gameId } });
				} else {
					// 如果游戏不存在，清除当前 session 并显示警告
					gameSessionStore.clearGameId();
					noGameSession.value = true;
				}
			} else {
				noGameSession.value = true;
			}
		};

		const gameId = computed(() => gameSessionStore.currentGameId)

		return { continueGame, gameId, noGameSession };
	},
});
</script>