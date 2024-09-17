<template>
	<div>
		<h2>游戏历史记录</h2>

		<!-- 删除成功的提示消息 -->
		<v-alert v-if="showDeleteAlert" type="success" dismissible @input="showDeleteAlert = false" class="my-4">
			游戏记录已成功删除。
		</v-alert>
		<v-data-table :headers="historyHeaders" :items="games" class="mt-4">
			<template #item.actions="{ item }">
				<v-btn color="primary" @click="viewGame(item.id)">查看</v-btn>
				<v-btn color="error" @click="confirmDelete(item)" v-if="item.player_count === 0">删除</v-btn>
			</template>
			<template #item.created_at="{ item }">
				<span>{{ item.created_at }}</span>
			</template>
			<template #item.summary="{ item }">
				<span :style="{ color: item.summary ? 'green' : 'red' }">{{ item.summary ? "有" : "无" }}</span>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import firebaseDb from "@/Lib/FirebaseDb";
import { dateDisplay } from "@/Lib/DateHelper";

const db = firebaseDb;

export default defineComponent({
	name: "History",
	data() {
		return {
			games: [], // 所有游戏的列表
			showDeleteAlert: false, // 控制删除成功消息的显示状态
			loading: false, // 防止多次触发请求
			historyHeaders: [
				{ title: "游戏ID", key: "id" },
				{ title: "创建时间", key: "created_at" },
				{ title: "玩家数量", key: "player_count" },
				{ title: "每手筹码", key: "chips_per_hand" },
				{ title: "每手金额", key: "amount_per_hand" },
				{ title: "总结", key: "summary" },
				{ title: "操作", key: "actions", sortable: false },
			],
		};
	},
	methods: {
		async fetchAllGames() {
			if (this.loading) return; // 防止多次请求
			this.loading = true;

			try {
				const gamesRef = collection(db, "games");
				const querySnapshot = await getDocs(gamesRef);
				const gameDataPromises = querySnapshot.docs.map(async (doc) => {
					const data = doc.data();
					console.log(data);
					const gameId = doc.id;

					// 获取players子集合中的文档数量
					const playersRef = collection(db, `games/${gameId}/players`);
					const playersSnapshot = await getDocs(playersRef);
					const playerCount = playersSnapshot.size; // 子集合中文档的数量

					return {
						id: gameId,
						created_at: dateDisplay(new Date(data.created_at)),
						sortfield: new Date(data.created_at),
						player_count: playerCount,
						chips_per_hand: data.chips_per_hand,
						amount_per_hand: data.amount_per_hand,
						summary: data.hasOwnProperty("summary"),
					};
				});

				// 等待所有Promise完成后排序
				const games = await Promise.all(gameDataPromises);

				// 按创建时间排序（最新的在前）
				this.games = games.sort((a, b) => b.sortfield - a.sortfield);
			} catch (error) {
				console.error("Error fetching all games:", error);
				alert("无法加载游戏历史，请重试。");
			} finally {
				this.loading = false;
			}
		},

		viewGame(gameId) {
			// 跳转到GameManagement页面，并传递gameId
			this.$router.push({ name: "GameManagement", params: { gameId } });
		},
		async confirmDelete(game) {
			const confirmation = confirm(`您确定要删除游戏 ${game.id} 吗？此操作不可撤销。`);
			if (confirmation) {
				await this.deleteGame(game.id);
			}
		},

		async deleteGame(gameId) {
			try {
				const gameRef = doc(db, "games", gameId);
				await deleteDoc(gameRef);
				this.games = this.games.filter(game => game.id !== gameId); // 从列表中移除已删除的游戏
				this.showDeleteAlert = true; // 显示删除成功的提示消息

				// 在 3 秒后自动隐藏提示消息
				setTimeout(() => {
					this.showDeleteAlert = false;
				}, 3000);
			} catch (error) {
				console.error("Error deleting game:", error);
				alert("删除游戏记录时出错，请重试。");
			}
		},
	},
	created() {
		this.fetchAllGames();
	},
});
</script>

<style scoped>
.v-btn {
	margin: 10px;
}
</style>
