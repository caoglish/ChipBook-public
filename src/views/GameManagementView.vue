<template>
	<div>
		<!-- 创建新德州局按钮 -->
		<v-btn v-if="!gameId" color="primary" @click="openNewGameDialog">创建新德州局</v-btn>

		<!-- 创建新德州局对话框 -->
		<v-dialog v-model="newGameDialog" max-width="500px">
			<v-card>
				<v-card-title>创建新德州局</v-card-title>
				<v-card-text>
					<!-- 输入每手筹码数 -->
					<v-select v-model="chipsPerHand" :items="chipsPerHandOptions" label="每手筹码数" clearable></v-select>
					<v-text-field v-model="chipsPerHandCustom" label="自定义每手筹码数" type="number"
						v-if="chipsPerHand === 'custom'"></v-text-field>

					<!-- 输入每手金额 -->
					<v-select v-model="amountPerHand" :items="amountPerHandOptions" label="每手金额" clearable></v-select>
					<v-text-field v-model="amountPerHandCustom" label="自定义每手金额" type="number"
						v-if="amountPerHand === 'custom'"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="createNewGame">创建</v-btn>
					<v-btn color="grey darken-1" @click="newGameDialog = false">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<div ref="gameInfo" class="print-container" v-if="currentGame">
			<!-- 显示当前局信息 -->
			<div v-if="currentGame">
				<h2>当前局信息</h2>
				<p>session id: {{ currentGame.id }}</p>
				<p>创建时间: {{ currentGame.created_at }}</p>
				<p>一手筹码数: {{ currentGame.chips_per_hand }}</p>
				<p>每手金额: {{ currentGame.amount_per_hand }}</p>

				<!-- 加入玩家按钮 -->
				<v-btn color="secondary" @click="openAddPlayersDialog">加入玩家</v-btn>
			</div>

			<PlayerTable :players="players" :isExporting="isExporting" @buy-in="buyIn" @set-remaining="setRemaining"
				@refund="refund" />

			<!-- 引入总结表格组件 -->
			<SummaryTable :summaryData="summaryData" :isExporting="isExporting" :gameId="currentGame.id"
				@save-summary="saveSummary" />

			<!-- 日志记录表格 -->
			<h3>日志记录</h3>
			<!-- 切换显示模式的按钮 -->
			<v-btn color="primary" @click="sortLogsByPlayer">按玩家排序</v-btn>
			<v-btn color="secondary" @click="sortLogsByTime">按时间排序</v-btn>
			<v-data-table :headers="logHeaders" :items="combinedLogs" :items-per-page="-1" :hide-default-footer="1"
				class="mt-4"></v-data-table>
		</div>

		<!-- 打印按钮 -->
		<v-btn v-if="currentGame" color="primary" @click="printGameInfo">打印游戏信息</v-btn>

		<!-- 添加玩家对话框 -->
		<v-dialog v-model="addPlayersDialog" max-width="500px">
			<v-card>
				<v-card-title>选择玩家</v-card-title>
				<v-card-text>
					<v-select v-model="selectedPlayers" :items="ForSelectPlayer" item-title="player_name"
						item-value="id" label="选择一个或多个玩家" chips multiple></v-select>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="addPlayersToGame">添加</v-btn>
					<v-btn color="grey darken-1" @click="addPlayersDialog = false">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- 买入手数对话框 -->
		<v-dialog v-model="buyInDialog" max-width="400px">
			<v-card>
				<v-card-title>玩家买入</v-card-title>
				<v-card-text>
					<v-text-field v-model="buyInAmount" label="买入手数" type="number"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="confirmBuyIn">确认</v-btn>
					<v-btn color="grey darken-1" @click="buyInDialog = false">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- 退码手数对话框 -->
		<v-dialog v-model="refundDialog" max-width="400px">
			<v-card>
				<v-card-title>玩家退码</v-card-title>
				<v-card-text>
					<v-text-field v-model="refundAmount" label="退码手数" type="number"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="confirmRefund">确认</v-btn>
					<v-btn color="grey darken-1" @click="refundDialog = false">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- 剩余筹码对话框 -->
		<v-dialog v-model="remainingDialog" max-width="400px">
			<v-card>
				<v-card-title>设置剩余筹码</v-card-title>
				<v-card-text>
					<v-text-field v-model="remainingAmount" label="剩余筹码数" type="number"></v-text-field>
				</v-card-text>
				<v-card-actions>
					<v-btn color="blue darken-1" @click="confirmRemaining">确认</v-btn>
					<v-btn color="grey darken-1" @click="remainingDialog = false">取消</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import html2canvas from "html2canvas"; // 引入html2canvas库
import {
	collection,
	addDoc,
	getDoc,
	getDocs,
	doc,
	updateDoc,
	query,
	where,
	setDoc,
	arrayUnion,
	
} from "firebase/firestore";
import firebaseDb from "@/Lib/FirebaseDb";
import playerHelper from "@/Lib/PlayerHelper";
import logHelper from "@/Lib/LogHelper";
import { dateDisplay, firebaseTimestamp } from "@/Lib/DateHelper";
import PlayerTable from "@/components/PlayerTable.vue"; // 导入新的组件
import SummaryTable from "@/components/SummaryTable.vue"; // 导入新的组件
import { useGameSessionStore } from '@/store/GameSessionStore'; // 引入 store

const db = firebaseDb;

export default defineComponent({
	name: "GameManagement",
	components: {
		PlayerTable,
		SummaryTable,
	},
	setup() {
		const GameSessionStore = useGameSessionStore();
		return {
			GameSessionStore
		}
	},
	props: {
		gameId: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			currentGame: null,
			newGameDialog: false,
			addPlayersDialog: false,
			buyInDialog: false,
			refundDialog: false,
			remainingDialog: false,
			allPlayers: [], // 所有玩家列表
			selectedPlayers: [],
			players: [],

			combinedLogs: [], // 组合的日志列表
			buyInAmount: 0,
			refundAmount: 0, // 退码手数
			remainingAmount: 0, // 剩余筹码数
			currentPlayerId: null,
			chipsPerHand: 500,
			chipsPerHandCustom: null,
			amountPerHand: 50,
			amountPerHandCustom: null,

			chipsPerHandOptions: [500, 1000, "custom"],
			amountPerHandOptions: [50, 100, "custom"],
			isExporting: false,

			

			logHeaders: [
				{ title: "时间", key: "date" },
				{ title: "玩家名称", key: "player_display_name" },
				{ title: "操作类型", key: "action" },
				{ title: "详细信息", key: "details" },
			],

			sortByPlayer: false, // 是否按玩家排序的标志
		};
	},
	computed:
	{
		ForSelectPlayer() {
			console.log(this.allPlayers);
			return this.allPlayers.filter((p) => p.allow_select)
		},


		// 动态生成 headers，导出图片时不显示操作列

		summaryData() {
			const totalPlayers = this.players.length;
			const totalHandsBought = this.players.reduce(
				(sum, player) => sum + player.hands_bought,
				0
			);
			const totalChipsBought = this.players.reduce(
				(sum, player) => sum + player.chips_bought,
				0
			);
			const totalAmountBought = this.players.reduce(
				(sum, player) => sum + player.amount_bought,
				0
			);
			const totalRemainingChips = this.players.reduce(
				(sum, player) => sum + (player.remaining_chips || 0),
				0
			);
			const totalWinLossChips = this.players.reduce(
				(sum, player) =>
					sum +
					(player.win_loss_chips !== "未计算" ? player.win_loss_chips : 0),
				0
			);
			const totalWinLossAmount = this.players.reduce(
				(sum, player) =>
					sum +
					(player.win_loss_amount !== "未计算" ? player.win_loss_amount : 0),
				0
			);

			// 检查是否所有的 win_loss_chips 都已计算
			const isWinLossCalculated = this.players.every(
				(player) => player.win_loss_chips !== "未计算"
			);
			console.log(isWinLossCalculated);
			const isZero = isWinLossCalculated && totalWinLossChips === 0;

			return {
				total_players: totalPlayers,
				total_hands_bought: totalHandsBought,
				total_chips_bought: totalChipsBought,
				total_amount_bought: totalAmountBought,
				total_remaining_chips: totalRemainingChips,
				total_win_loss_chips: totalWinLossChips,
				total_win_loss_amount: totalWinLossAmount,
				is_zero: isZero,
				is_game_completed: isWinLossCalculated,
				// game_status: isWinLossCalculated ? "游戏结束" : "游戏未结束",
			};
		},

		summaryHeadersToShow() {
			return this.isExporting
				? this.summaryHeaders.filter((header) => header.key !== "actions")
				: this.summaryHeaders;
		},
	},
	methods: {
		openNewGameDialog() {
			this.newGameDialog = true;
		},
		async printGameInfo() {
			const gameInfoElement = this.$refs.gameInfo; // 获取需要截图的元素
			const buttons = document.querySelectorAll("button, .v-btn"); // 选择所有按钮元素
			buttons.forEach((button) => (button.style.visibility = "hidden")); // 隐藏所有按钮
			this.isExporting = true; // 设置为导出状态，隐藏操作列和按钮
			await this.$nextTick(); // 等待视图更新，确保所有按钮和操作列隐藏

			if (gameInfoElement) {
				try {
					const canvas = await html2canvas(gameInfoElement, {
						scrollX: 0,
						scrollY: 0,
						windowWidth: document.documentElement.clientWidth,
						windowHeight: document.documentElement.scrollHeight,
					});
					const imgData = canvas.toDataURL("image/png");

					// 创建一个新的窗口并打印图像
					const printWindow = window.open("", "_blank");
					printWindow.document.write(`<img src="${imgData}" />`);
					printWindow.document.close();
				} catch (error) {
					console.error("Error generating image:", error);
					alert("无法生成游戏信息的图片，请重试。");
				} finally {
					// 恢复所有按钮的可见性
					buttons.forEach((button) => (button.style.visibility = "visible"));
					this.isExporting = false; // 恢复正常状态，显示操作列和按钮
				}
			}
		},

		async selectGame(gameId) {
			this.currentGame = await this.fetchGameById(gameId);
			await this.fetchInGamePlayers();
			await this.fetchAllPlayerLogs();
		},
		async fetchGameById(gameId) {
			try {
				const gameRef = doc(db, "games", gameId);
				const gameSnapshot = await getDoc(gameRef);
				console.log(gameSnapshot);
				if (gameSnapshot.exists()) {
					return { id: gameId, ...gameSnapshot.data() };
				} else {
					console.error("No game found with the given ID.");
					alert("无法找到指定的游戏。");
					return null;
				}
			} catch (error) {
				console.error("Error fetching game by ID:", error);
				alert("无法获取游戏信息，请重试。");
				return null;
			}
		},
		async createNewGame() {
			try {
				const chipsPerHandValue =
					this.chipsPerHand === "custom"
						? this.chipsPerHandCustom
						: this.chipsPerHand;
				const amountPerHandValue =
					this.amountPerHand === "custom"
						? this.amountPerHandCustom
						: this.amountPerHand;

				const gameData = {
					created_at: dateDisplay(),
					chips_per_hand: parseInt(chipsPerHandValue, 10),
					amount_per_hand: parseInt(amountPerHandValue, 10),
					created_at_timestamp: firebaseTimestamp(),
				};
				const gameRef = await addDoc(collection(db, "games"), gameData);
				this.resetGame();
				this.currentGame = { id: gameRef.id, ...gameData };
				console.log('current game id:', gameRef.id)
				this.GameSessionStore.setGameId(gameRef.id)

				this.newGameDialog = false;
			} catch (error) {
				console.error("Error creating new game:", error);
				alert("无法创建新游戏，请重试。");
			}
		},
		resetGame() {
			this.players = [];
			this.selectedPlayers = [];
			this.combinedLogs = [];
		},
		openAddPlayersDialog() {
			this.addPlayersDialog = true;
		},
		async addPlayersToGame() {
			try {
				this.addPlayersDialog = false;
				const gameRef = doc(db, "games", this.currentGame.id);


				for (const playerId of this.selectedPlayers) {
					if (this.players.some((p) => p.player_id === playerId)) {
						continue;
					}

					const player = this.allPlayers.find((p) => p.id === playerId);

					const newPlayerData = {
						player_id: playerId,
						player_name: player.player_name,
						player_display_name: player.player_display_name,
						hands_bought: 1,
						chips_bought: this.currentGame.chips_per_hand,
						amount_bought: this.currentGame.amount_per_hand,
						remaining_chips: null,
						win_loss_chips: "未计算",
						win_loss_amount: "未计算",
						logs: [],
					};
					console.log("players", this.players);
					const playerIndex = playerHelper.getNextPlayerId(this.players);
					console.log("playerIndex", playerIndex);
					await setDoc(doc(gameRef, "players", playerIndex), newPlayerData);

					// 添加加入游戏的log
					const logEntry = {
						date: dateDisplay(),
						action: "join",
						hands: 1,
						timestamp: firebaseTimestamp(),
					};

					await updateDoc(doc(gameRef, "players", playerIndex), {
						logs: arrayUnion(logEntry),
					});
					await this.fetchInGamePlayers();
					await this.fetchAllPlayerLogs();
				}
			} catch (error) {
				console.error("Error adding players to game:", error);
				alert("无法添加玩家，请重试。");
			}
		},
		buyIn(player) {
			this.currentPlayerId = player.player_id;
			this.buyInDialog = true;
		},
		refund(player) {
			this.currentPlayerId = player.player_id;
			this.refundDialog = true;
		},
		setRemaining(player) {
			this.currentPlayerId = player.player_id;
			this.remainingDialog = true;
		},
		async fetchPlayerById(playerId) {
			try {
				const gameRef = doc(db, "games", this.currentGame.id);
				const playersRef = collection(gameRef, "players");
				const q = query(playersRef, where("player_id", "==", playerId));
				const querySnapshot = await getDocs(q);
				if (!querySnapshot.empty) {
					const playerDoc = querySnapshot.docs[0];
					return { id: playerDoc.id, data: playerDoc.data() };
				} else {
					console.log("No player found with the given ID");
					return null;
				}
			} catch (error) {
				console.error("Error fetching player by ID:", error);
				alert("无法获取玩家信息，请重试。");
				return null;
			}
		},
		async confirmBuyIn() {
			let buyin = parseInt(this.buyInAmount, 10);

			if (this.currentPlayerId && buyin > 0) {
				const playerResult = await this.fetchPlayerById(this.currentPlayerId);

				if (playerResult) {
					const playerData = playerResult.data;
					const playerDocId = playerResult.id;
					const newHandsBought = playerData.hands_bought + buyin;
					const newChipsBought =
						newHandsBought * this.currentGame.chips_per_hand;
					const newAmountBought =
						newHandsBought * this.currentGame.amount_per_hand;
					const winLossChips =
						playerData.remaining_chips !== null
							? this.calculateWinLossChips(
								newChipsBought,
								playerData.remaining_chips
							)
							: "未计算";

					try {
						const gameRef = doc(db, "games", this.currentGame.id);
						const playerRef = doc(collection(gameRef, "players"), playerDocId);
						console.log("debug:", playerResult)
						console.log("debug:", playerDocId)
						await updateDoc(playerRef, {
							hands_bought: newHandsBought,
							chips_bought: newChipsBought,
							amount_bought: newAmountBought,
							win_loss_chips: winLossChips,
							win_loss_amount:
								playerData.remaining_chips !== null
									? this.calculateWinLossAmount(winLossChips)
									: "未计算",
							logs: arrayUnion({
								date: dateDisplay(),
								action: "buyin",
								hands: this.buyInAmount,
								timestamp: firebaseTimestamp(),
							}),
						});

						this.fetchAllPlayerLogs();

						const player = this.players.find(
							(p) => p.player_id === this.currentPlayerId
						);
						player.hands_bought = newHandsBought;
						player.chips_bought = newChipsBought;
						player.amount_bought = newAmountBought;
						player.win_loss_chips = winLossChips;
						player.win_loss_amount =
							playerData.remaining_chips !== null
								? this.calculateWinLossAmount(winLossChips)
								: "未计算";

						this.buyInDialog = false;
						this.buyInAmount = 0;
					} catch (error) {
						console.error("Error updating buy-in data:", error);
						alert("买入操作失败，请重试。");
					}
				}
			}
		},
		async confirmRefund() {
			let refund = parseInt(this.refundAmount, 10);

			if (this.currentPlayerId && refund > 0) {
				const playerResult = await this.fetchPlayerById(this.currentPlayerId);
				if (playerResult) {
					const playerData = playerResult.data;
					const playerDocId = playerResult.id;
					const newHandsBought = playerData.hands_bought - refund;

					if (newHandsBought < 0) {
						alert("退码手数不能超过当前买入手数！");
						return;
					}
					const newChipsBought =
						newHandsBought * this.currentGame.chips_per_hand;
					const newAmountBought =
						newHandsBought * this.currentGame.amount_per_hand;
					const winLossChips =
						playerData.remaining_chips !== null
							? this.calculateWinLossChips(
								newChipsBought,
								playerData.remaining_chips
							)
							: "未计算";

					try {
						const gameRef = doc(db, "games", this.currentGame.id);
						const playerRef = doc(collection(gameRef, "players"), playerDocId);
						await updateDoc(playerRef, {
							hands_bought: newHandsBought,
							chips_bought: newChipsBought,
							amount_bought: newAmountBought,
							win_loss_chips: winLossChips,
							win_loss_amount:
								playerData.remaining_chips !== null
									? this.calculateWinLossAmount(winLossChips)
									: "未计算",
							logs: arrayUnion({
								date: dateDisplay(),
								action: "refund",
								hands: refund,
								timestamp: firebaseTimestamp(),
							}),
						});

						this.fetchAllPlayerLogs();

						const player = this.players.find(
							(p) => p.player_id === this.currentPlayerId
						);
						player.hands_bought = newHandsBought;
						player.chips_bought = newChipsBought;
						player.amount_bought = newAmountBought;
						player.win_loss_chips = winLossChips;
						player.win_loss_amount =
							playerData.remaining_chips !== null
								? this.calculateWinLossAmount(winLossChips)
								: "未计算";

						this.refundDialog = false;
						this.refundAmount = 0;
					} catch (error) {
						console.error("Error updating refund data:", error);
						alert("退码操作失败，请重试。");
					}
				}
			}
		},
		async confirmRemaining() {
			let remaining = parseInt(this.remainingAmount, 10);

			if (this.currentPlayerId && remaining >= 0) {
				const playerResult = await this.fetchPlayerById(this.currentPlayerId);
				if (playerResult) {
					const playerData = playerResult.data;
					const playerDocId = playerResult.id;
					const winLossChips = this.calculateWinLossChips(
						playerData.chips_bought,
						remaining
					);

					try {
						const gameRef = doc(db, "games", this.currentGame.id);
						const playerRef = doc(collection(gameRef, "players"), playerDocId);
						await updateDoc(playerRef, {
							remaining_chips: remaining,
							win_loss_chips: winLossChips,
							win_loss_amount: this.calculateWinLossAmount(winLossChips),
							logs: arrayUnion({
								date: dateDisplay(),
								action: "setRemaining",
								chips: remaining,
								timestamp: firebaseTimestamp(),
							}),
						});

						this.fetchAllPlayerLogs();

						const player = this.players.find(
							(p) => p.player_id === this.currentPlayerId
						);
						player.remaining_chips = remaining;
						player.win_loss_chips = winLossChips;
						player.win_loss_amount = this.calculateWinLossAmount(winLossChips);

						this.remainingDialog = false;
						this.remainingAmount = 0;
					} catch (error) {
						console.error("Error updating remaining chips:", error);
						alert("更新剩余筹码失败，请重试。");
					}
				}
			}
		},

		calculateWinLossChips(chipsBought, remainingChips) {
			return remainingChips - chipsBought;
		},
		calculateWinLossAmount(winLossChips) {
			let result = winLossChips *
				(this.currentGame.amount_per_hand / this.currentGame.chips_per_hand);
			return result.toFixed(2);
		},

		async fetchAllPlayerLogs() {
			try {
				// 获取当前游戏中的所有玩家日志
				const gameRef = doc(db, "games", this.currentGame.id);
				const combinedLogs = [];

				const playersSnapshot = await getDocs(collection(gameRef, "players"));
				const allplayers = playersSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				const allLogs = allplayers.reduce((accumulator, currentpalyer) => {
					console.log(accumulator);
					console.log(currentpalyer.logs);
					const logs = currentpalyer.logs.map((item) => ({
						...item,
						player_display_name: currentpalyer.player_display_name,
						player_id: currentpalyer.player_id,
						details: logHelper.makeLogDetail(item),
					}));

					return accumulator.concat(logs);
				}, []);
				console.log("allLogs:", allLogs);
				this.combinedLogs = allLogs;
				this.sortLogs();
			} catch (error) {
				console.error("Error fetching all player logs:", error);
				alert("无法加载所有玩家日志，请重试。");
			}

		},
		sortLogs() {
			if (this.sortByPlayer) {
				this.combinedLogs.sort((a, b) => {
					if (a.player_id === b.player_id) {
						return a.timestamp.toDate() - b.timestamp.toDate();
					}
					return a.player_id.localeCompare(b.player_id);
				});
			} else {
				this.combinedLogs.sort(
					(a, b) => a.timestamp.toDate() - b.timestamp.toDate()
				);
			}
		},
		sortLogsByPlayer() {
			this.sortByPlayer = true;
			this.sortLogs();
		},
		sortLogsByTime() {
			this.sortByPlayer = false;
			this.sortLogs();
		},
		async fetchPlayers() {
			try {
				const playersSnapshot = await getDocs(collection(db, "players"));
				this.allPlayers = playersSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
			} catch (error) {
				console.error("Error fetching players:", error);
				alert("无法加载玩家列表，请重试。");
			}
		},
		async fetchInGamePlayers() {
			try {
				const gameRef = doc(db, "games", this.currentGame.id);
				const inGamePlayersSnapshot = await getDocs(
					collection(gameRef, "players")
				);
				this.players = inGamePlayersSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
			} catch (error) {
				console.error("Error fetching in-game players:", error);
				alert("无法加载当前游戏中的玩家，请重试。");
			}
		},
	},
	async created() {
		console.log(dateDisplay());
		console.log(this.gameId);
		if (this.gameId) {
			// 如果提供了gameId，直接加载该游戏的信息
			await this.selectGame(this.gameId);
		} 
		this.fetchPlayers();
	},
});
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
