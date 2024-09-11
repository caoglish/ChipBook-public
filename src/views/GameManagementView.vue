<template>
  <div>
    <!-- 列出当天的所有游戏 -->
    <h2>当天的游戏进程</h2>
    <v-data-table :headers="gameHeaders" :items="games" class="mt-4">
      <template #item.actions="{ item }">
        <v-btn @click="selectGame(item)">继续记录</v-btn>
      </template>
    </v-data-table>

    <!-- 创建新德州局按钮 -->
    <v-btn color="primary" @click="createNewGame">创建新德州局</v-btn>

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

    <!-- 玩家信息表格 -->
    <v-data-table :headers="playerHeaders" :items="players" class="mt-4">
      <template #item.actions="{ item }">
        <v-btn @click="buyIn(item)">买入</v-btn>
        <v-btn @click="setRemaining(item)">剩余</v-btn>
        <v-btn @click="refund(item)">退码</v-btn>
      </template>
      <template #item.remaining_chips="{ item }">
        <span>{{ item.remaining_chips !== null ? item.remaining_chips : '未输入' }}</span>
      </template>
      <template #item.win_loss_chips="{ item }">
        <span>{{ item.remaining_chips !== null ? item.win_loss_chips : '未计算' }}</span>
      </template>
      <template #item.win_loss_amount="{ item }">
        <span>{{ item.remaining_chips !== null ? item.win_loss_amount : '未计算' }}</span>
      </template>
    </v-data-table>

    <!-- 日志记录表格 -->
    <h3>日志记录</h3>
    <!-- 切换显示模式的按钮 -->
    <v-btn color="primary" @click="sortLogsByPlayer">按玩家排序</v-btn>
    <v-btn color="secondary" @click="sortLogsByTime">按时间排序</v-btn>
    <v-data-table :headers="logHeaders" :items="combinedLogs" class="mt-4"></v-data-table>

    <!-- 添加玩家对话框 -->
    <v-dialog v-model="addPlayersDialog" max-width="500px">
      <v-card>
        <v-card-title>选择玩家</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedPlayers"
            :items="allPlayers"
            item-title="player_name"
            item-value="id"
            label="选择一个或多个玩家"
            chips
            multiple
          ></v-select>
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
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import firebaseDb from "@/Lib/FirebaseDb";

const db = firebaseDb;

export default defineComponent({
  name: "GameManagement",
  data() {
    return {
      games: [], // 当天的游戏列表
      currentGame: null,
      addPlayersDialog: false,
      buyInDialog: false,
      refundDialog: false,
      remainingDialog: false,
      allPlayers: [], // 所有玩家列表
      selectedPlayers: [],
      players: [],
      logs: [],
      combinedLogs: [], // 组合的日志列表
      buyInAmount: 0,
      refundAmount: 0, // 退码手数
      remainingAmount: 0, // 剩余筹码数
      currentPlayerId: null,
      gameHeaders: [
        { title: "游戏ID", key: "id" },
        { title: "创建时间", key: "created_at" },
        { title: "操作", value: "actions", sortable: false },
      ],
      playerHeaders: [
        { title: "固定名称", key: "player_name" },
        { title: "显示名称", key: "player_display_name" },
        { title: "买入手数", key: "hands_bought" },
        { title: "买入筹码", key: "chips_bought" },
        { title: "买入金额", key: "amount_bought" },
        { title: "剩余筹码", key: "remaining_chips" },
        { title: "胜负筹码", key: "win_loss_chips" },
        { title: "胜负金额", key: "win_loss_amount" },
        { title: "操作", value: "actions", sortable: false },
      ],
      logHeaders: [
        { title: "时间", key: "date" },
        { title: "操作类型", key: "action" },
        { title: "玩家名称", key: "player_display_name" },
        { title: "详细信息", key: "details" },
      ],
      sortByPlayer: true, // 是否按玩家排序的标志
    };
  },
  methods: {
    async fetchTodayGames() {
      try {
        const today = new Date().toLocaleDateString();
        const gamesRef = collection(db, "games");
        const q = query(gamesRef, where("created_at", ">=", today));
        const querySnapshot = await getDocs(q);
        this.games = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching today's games:", error);
        alert("无法加载当天的游戏，请重试。");
      }
    },
    async selectGame(game) {
      this.currentGame = game;
      await this.fetchInGamePlayers();
      await this.fetchAllPlayerLogs();
    },
    async createNewGame() {
      try {
        const gameData = {
          created_at: new Date().toLocaleString(),
          chips_per_hand: 500,
          amount_per_hand: 50,
        };
        const gameRef = await addDoc(collection(db, "games"), gameData);
        this.currentGame = { id: gameRef.id, ...gameData };
      } catch (error) {
        console.error("Error creating new game:", error);
        alert("无法创建新游戏，请重试。");
      }
    },
    openAddPlayersDialog() {
      this.addPlayersDialog = true;
    },
    async addPlayersToGame() {
      try {
        this.addPlayersDialog = false;
        const gameRef = doc(db, "games", this.currentGame.id);
        const currentPlayerCount = this.players.length;

        for (const playerId of this.selectedPlayers) {
          if (this.players.some((p) => p.player_id === playerId)) {
            continue;
          }
          const player = this.allPlayers.find((p) => p.id === playerId);
          const playerIndex = this.players.length + 1;
          const newPlayerData = {
            player_id: playerId,
            player_name: player.player_name,
            player_display_name: player.player_display_name,
            hands_bought: 0,
            chips_bought: 0,
            amount_bought: 0,
            remaining_chips: null,
            win_loss_chips: "未计算",
            win_loss_amount: "未计算",
            logs: [],
          };
          await setDoc(
            doc(gameRef, "players", `Player_${playerIndex}`),
            newPlayerData
          );
          this.players.push(newPlayerData);
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
                date: new Date().toLocaleString(),
                action: "buyin",
                hands_bought: this.buyInAmount,
                timestamp: new Date().toISOString(),
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
          const newHandsBought = Math.max(playerData.hands_bought - refund, 0);

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
                date: new Date().toLocaleString(),
                action: "refund",
                hands_refunded: refund,
                timestamp: new Date().toISOString(),
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
                date: new Date().toLocaleString(),
                action: "setRemaining",
                remaining_chips: remaining,
                timestamp: new Date().toISOString(),
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
      return chipsBought - remainingChips;
    },
    calculateWinLossAmount(winLossChips) {
      return (
        winLossChips *
        (this.currentGame.amount_per_hand / this.currentGame.chips_per_hand)
      );
    },

    async fetchAllPlayerLogs() {
      try {

		// 获取当前游戏中的所有玩家日志
        const gameRef = doc(db, "games", this.currentGame.id);
        const combinedLogs = [];

		const playersSnapshot = await getDocs(collection(gameRef, "players"));
		const allplayers=playersSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			}));
		const allLogs=allplayers.reduce((accumulator, currentpalyer)=>{

			console.log(accumulator);
			console.log(currentpalyer.logs);
			const logs=currentpalyer.logs.map((item)=>({
				...item,
				player_display_name: currentpalyer.player_display_name,
                player_id: currentpalyer.player_id,
				details: {'remaining_chips':item.remaining_chips,
							'hands_bought':item.hands_bought,
							'hands_refunded':item.hands_refunded
				}
			}
			));
			
			return  accumulator.concat(logs);
		},[])
		console.log(allLogs);
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
            return new Date(a.timestamp) - new Date(b.timestamp);
          }
          return a.player_id.localeCompare(b.player_id);
        });
      } else {
        this.combinedLogs.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
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
  created() {
    this.fetchTodayGames();
    this.fetchPlayers();
	
  },
});
</script>

<style scoped>
.v-btn {
  margin: 10px;
}
</style>
