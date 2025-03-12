// store/useGameStore.js
import { defineStore } from "pinia";
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
import { dateDisplay, firebaseTimestamp } from "@/Lib/DateHelper";
import { useLogStore } from "@/store/useLogStore";
import { useCurrentGameIdStore } from "@/store/useCurrentGameIdStore";
import { useLoginUserStore } from "@/store/useLoginUserStore";
import { useLoginUserCollectionStore } from "@/store/useLoginUserCollectionStore";
import { DEFAULT_BUYIN_AMOUNT } from "@/constants/appConstants";
import { GameStatusEnum,GameStatusMapping } from "@/Type/GameStatus";
const db = firebaseDb;

export const useGameStore = defineStore("useGameStore", {
	state: () => ({
		currentGame: null,
		newGameDialog: false,
		addPlayersDialog: false,
		buyInDialog: false,
		refundDialog: false,
		remainingDialog: false,

		selectedPlayers: [],
		players: [], // Players in game

		buyInAmount: DEFAULT_BUYIN_AMOUNT,
		refundAmount: 0, // 退码手数
		remainingAmount: 0, // 剩余筹码数
		currentPlayer: null,
		chipsPerHand: 500,
		chipsPerHandCustom: 500, //default custom number
		amountPerHand: 50,
		amountPerHandCustom: 50, //default custom amount

		chipsPerHandOptions: [500, 1000, "custom"],
		amountPerHandOptions: [50, 100, "custom"],
		isExporting: false,
		showAlert: false, // 控制 alert 显示状态
		sortByPlayer: false,
		gameCreater: null, // 是否按玩家排序的标志
	}),
	getters: {
		 getGameStatus(state) {
			const { total_players, is_game_completed, is_zero } = state.summaryData;

			if (total_players === 0) {
				return GameStatusMapping[GameStatusEnum.NOT_STARTED];
			}
		
			if (is_game_completed) {
				return GameStatusMapping[!is_zero  ? GameStatusEnum.REVIEW_PENDING : GameStatusEnum.COMPLETED];
			}
		
			return GameStatusMapping[GameStatusEnum.IN_PROGRESS];
		},

		isWinLossCalculated(state) {
			return state.players.every((player) => player.win_loss_chips !== null);
		},

		summaryData(state) {
			const totalPlayers = state.players.length;
			const totalHandsBought = state.players.reduce(
				(sum, player) => sum + player.hands_bought,
				0
			);
			const totalChipsBought = state.players.reduce(
				(sum, player) => sum + player.chips_bought,
				0
			);
			const totalAmountBought = state.players.reduce(
				(sum, player) => sum + player.amount_bought,
				0
			);
			const totalRemainingChips = state.players.reduce(
				(sum, player) => sum + (player.remaining_chips || 0),
				0
			);
			const totalWinLossChips = state.players.reduce(
				(sum, player) =>
					sum + (player.win_loss_chips !== null ? player.win_loss_chips : 0),
				0
			);
			const totalWinLossAmount = state.players
				.reduce(
					(sum, player) =>
						sum +
						(player.win_loss_amount !== null
							? parseFloat(player.win_loss_amount)
							: 0), // in case firebase saves amount as string
					0
				)
				.toFixed(2);

			const isZero = this.isWinLossCalculated && totalWinLossChips === 0;

			return {
				total_players: totalPlayers,
				total_hands_bought: totalHandsBought,
				total_chips_bought: totalChipsBought,
				total_amount_bought: totalAmountBought,
				total_remaining_chips: totalRemainingChips,
				total_win_loss_chips: totalWinLossChips,
				total_win_loss_amount: totalWinLossAmount,
				is_zero: isZero,
				is_game_completed: this.isWinLossCalculated,
			};
		},
		playerWithMostChips(state) {
			if (state.players.length === 0 || !this.isWinLossCalculated) return null;

			// 找到最高的 win_loss_chips
			const maxChips = Math.max(
				...state.players.map((player) => player.win_loss_chips)
			);

			// 过滤出所有 win_loss_chips 等于 maxChips 的玩家
			return state.players.filter(
				(player) => player.win_loss_chips === maxChips
			);
		},
	},
	actions: {
		async openNewGameDialog() {
			this.newGameDialog = true;
		},

		closeNewGameDialog() {
			this.newGameDialog = false;
		},
		async createNewGame() {
			const currentGameIdStore = useCurrentGameIdStore();
			const loginUserStore = useLoginUserStore();
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
					created_by: loginUserStore.user.uid,
				};
				const gameRef = await addDoc(collection(db, "games"), gameData);
				this.resetGame();
				this.currentGame = { id: gameRef.id, ...gameData };
				console.log("current game id:", gameRef.id);

				currentGameIdStore.setGameId(this.currentGame.id);
				console.log(currentGameIdStore);
				this.newGameDialog = false;
			} catch (error) {
				console.error("Error creating new game:", error);
				alert("无法创建新游戏，请重试。");
			}
		},
		resetGame() {
			this.players = [];
			this.selectedPlayers = [];
		},
		async selectGame(gameId) {
			this.currentGame = null;
			this.currentGame = await this.fetchGameById(gameId);
			await this.fetchGameCreater();
			await this.fetchInGamePlayers();
			await this.fetchAllPlayerLogsFromPlayerList();
			//console.log("gamestore", gameId);
			//console.log("gamestore currentGame", this.currentGame);
		},
		async fetchGameCreater() {
			const loginUserCollectionStore = useLoginUserCollectionStore();
			const user = await loginUserCollectionStore.getLoginUserFromCollection(
				this.currentGame.created_by
			);
			console.log("gameCreater", user?.displayName);
			this.gameCreater = user?.displayName;
		},
		async fetchGameById(gameId) {
			try {
				const gameRef = doc(db, "games", gameId);
				const gameSnapshot = await getDoc(gameRef);
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
		openAddPlayersDialog() {
			this.addPlayersDialog = true;
		},
		async addPlayersToGame(selectedPlayerList, PlayersList) {
			try {
				this.addPlayersDialog = false;
				const gameRef = doc(db, "games", this.currentGame.id);

				for (const playerId of selectedPlayerList) {
					if (this.players.some((p) => p.player_id === playerId)) {
						continue;
					}

					const player = PlayersList.find((p) => p.id === playerId);

					const newPlayerData = {
						player_id: playerId,
						player_name: player.player_name,
						player_display_name: player.player_display_name,
						hands_bought: 1,
						chips_bought: this.currentGame.chips_per_hand,
						amount_bought: this.currentGame.amount_per_hand,
						remaining_chips: null,
						win_loss_chips: null,
						win_loss_amount: null,
						logs: [],
					};
					const playerIndex = playerHelper.getNextPlayerId(this.players);
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
					await this.fetchAllPlayerLogsFromPlayerList();
				}
			} catch (error) {
				console.error("Error adding players to game:", error);
				alert("无法添加玩家，请重试。");
			}
		},
		buyIn(player) {
			this.currentPlayer = player;
			this.buyInDialog = true;
		},
		refund(player) {
			this.currentPlayer = player;
			this.refundDialog = true;
		},
		setRemaining(player) {
			this.currentPlayer = player;
			this.remainingAmount =
				player.remaining_chips !== null ? player.remaining_chips : 0;
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

			if (this.currentPlayer.player_id && buyin > 0) {
				const playerResult = await this.fetchPlayerById(
					this.currentPlayer.player_id
				);

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
							: null;

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
									: null,
							logs: arrayUnion({
								date: dateDisplay(),
								action: "buyin",
								hands: buyin,
								timestamp: firebaseTimestamp(),
							}),
						});

						await this.fetchInGamePlayers();
						await this.fetchAllPlayerLogsFromPlayerList();
						this.buyInDialog = false;
					} catch (error) {
						console.error("Error updating buy-in data:", error);
						alert("买入操作失败，请重试。");
					}
				}
			}
		},
		async confirmRefund() {
			let refund = parseInt(this.refundAmount, 10);

			if (this.currentPlayer.player_id && refund > 0) {
				const playerResult = await this.fetchPlayerById(
					this.currentPlayer.player_id
				);
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
							: null;

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
									: null,
							logs: arrayUnion({
								date: dateDisplay(),
								action: "refund",
								hands: refund,
								timestamp: firebaseTimestamp(),
							}),
						});

						await this.fetchInGamePlayers();
						await this.fetchAllPlayerLogsFromPlayerList();
						this.refundDialog = false;
					} catch (error) {
						console.error("Error updating refund data:", error);
						alert("退码操作失败，请重试。");
					}
				}
			}
		},
		async confirmRemaining() {
			let remaining = parseInt(this.remainingAmount, 10);

			if (this.currentPlayer.player_id && remaining >= 0) {
				const playerResult = await this.fetchPlayerById(
					this.currentPlayer.player_id
				);
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

						await this.fetchInGamePlayers();
						await this.fetchAllPlayerLogsFromPlayerList();
						this.remainingDialog = false;
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
			let result =
				winLossChips *
				(this.currentGame.amount_per_hand / this.currentGame.chips_per_hand);
			return parseFloat(result.toFixed(2));
		},
		cancelRemaining() {
			this.remainingDialog = false;
			this.remainingAmount = 0;
		},
		async fetchAllPlayerLogs() {
			const logStore = useLogStore();
			if (this.currentGame?.id) {
				await logStore.fetchAllPlayerLogs(this.currentGame.id);
			}
		},
		fetchAllPlayerLogsFromPlayerList() {
			const logStore = useLogStore();
			if (this.currentGame?.id && this.players.length > 0) {
				logStore.fetchAllPlayerLogsFromPlayerList(this.players);
			}
		},
		async saveSummary(gameId, summaryData) {
			try {
				const gameRef = doc(collection(db, "games"), gameId);

				// 更新 game 文档中的总结数据
				await updateDoc(gameRef, {
					summary: summaryData, // 保存总结数据到 Firebase
				});

				// 显示保存成功的提示框
				this.showAlert = true;

				// 3 秒后隐藏提示框
				setTimeout(() => {
					this.showAlert = false;
				}, 3000);
			} catch (error) {
				console.error("Error saving summary:", error);
				alert("无法保存总结，请重试。");
			}
		},
	},
});
