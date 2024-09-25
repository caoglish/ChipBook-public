<template>
	<v-dialog v-model="gameStore.newGameDialog" max-width="500px">
		<v-card>
			<v-card-title>创建新德州局</v-card-title>
			<v-card-text>
				<!-- 输入每手筹码数 -->
				<v-select v-model="gameStore.chipsPerHand" :items="gameStore.chipsPerHandOptions" label="每手筹码数"
					clearable />
				<v-text-field v-model="gameStore.chipsPerHandCustom" label="自定义每手筹码数" type="number"
					v-if="gameStore.chipsPerHand === 'custom'" />

				<!-- 输入每手金额 -->
				<v-select v-model="gameStore.amountPerHand" :items="gameStore.amountPerHandOptions" label="每手金额"
					clearable />
				<v-text-field v-model="gameStore.amountPerHandCustom" label="自定义每手金额" type="number"
					v-if="gameStore.amountPerHand === 'custom'" />
			</v-card-text>
			<v-card-actions>
				<v-btn color="blue darken-1" @click="gameStore.createNewGame">创建</v-btn>
				<v-btn color="grey darken-1" @click="gameStore.closeNewGameDialog">取消</v-btn>
			</v-card-actions>.
		</v-card>
	</v-dialog>
</template>

<script>
import { useGameStore } from '@/store/useGameStore'; // 引入使用的 Pinia store

export default {
	name: 'CreateNewGameDialog',
	setup() {
		const gameStore = useGameStore(); // 直接返回 gameStore

		return {
			gameStore, // 简单返回整个 store 对象，减少重复代码
		};
	},
};
</script>