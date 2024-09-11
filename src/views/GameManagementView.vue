<template>
  <div>
    <!-- 创建新德州局按钮 -->
    <v-btn color="primary" @click="createNewGame">创建新德州局</v-btn>

    <!-- 显示当前局信息 -->
    <div v-if="currentGame">
      <h2>当前局信息</h2>
	  <p>session id: {{currentGame.id}}</p>
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
        <v-btn @click="adjustLog(item)">调整</v-btn>
      </template>
    </v-data-table>

    <!-- 日志记录表格 -->
    <h3>日志记录</h3>
    <v-data-table :headers="logHeaders" :items="logs" class="mt-4"></v-data-table>

    <!-- 添加玩家对话框 -->
    <v-dialog v-model="addPlayersDialog" max-width="500px">
      <v-card>
        <v-card-title>选择玩家</v-card-title>
        <v-card-text>
          <v-select 
            v-model="selectedPlayers" 
            :items="allPlayers" 
            item-title='player_name'
	 	    item-value='id'
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

    <!-- 其他对话框逻辑省略 -->
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { collection, addDoc, getDocs, doc, updateDoc, getDoc, arrayUnion ,setDoc,where,query,limit,get} from 'firebase/firestore';
import firebaseDb from "@/Lib/FirebaseDb";

const db = firebaseDb;

export default defineComponent({
  name: "GameManagement",
  data() {
    return {
      currentGame: null,
      addPlayersDialog: false,
      buyInDialog: false,
      allPlayers: [], // 从总玩家列表中获取玩家
      selectedPlayers: [],
      players: [], // 当前游戏中的玩家列表
      logs: [], // 玩家操作日志
      buyInAmount: 0, // 买入手数
      currentPlayerId: null, // 当前操作的玩家ID
      playerHeaders: [
        { text: '固定名称', key: 'player_name' },
        { text: '显示名称', key: 'player_display_name' },
        { text: '买入手数', key: 'hands_bought' },
        { text: '买入筹码', key: 'chips_bought' },
        { text: '买入金额', key: 'amount_bought' },
        { text: '剩余筹码', key: 'remaining_chips' },
        { text: '胜负筹码', key: 'win_loss_chips' },
        { text: '胜负金额', key: 'win_loss_amount' },
        { text: '操作', value: 'actions', sortable: false }
      ],
      logHeaders: [
        { text: '时间', key: 'date' },
        { text: '操作类型', key: 'action' },
        { text: '详细信息', key: 'details' }
      ]
    };
  },
  methods: {
    async createNewGame() {
      // 创建新德州局
      const gameData = {
        created_at: new Date().toLocaleString(),
        chips_per_hand: 500, // 一手筹码数
        amount_per_hand: 50,  // 每手金额数
      };
      const gameRef = await addDoc(collection(db, 'games'), gameData);
      this.currentGame = { id: gameRef.id, ...gameData };
    },
    openAddPlayersDialog() {
      this.addPlayersDialog = true;
    },
    async addPlayersToGame() {
      this.addPlayersDialog = false;
      const gameRef = doc(db, 'games', this.currentGame.id);

      // 获取当前已有的玩家数量，用于生成player_n编号
      const currentPlayerCount = this.players.length;

      // 复制所选玩家到当前游戏的子集合
      for (const playerId of this.selectedPlayers) {
		
		
			
        if (this.players.some(p => p.player_id === playerId)) {
          continue; // 跳过已经添加的玩家，防止重复
        }
        const player = this.allPlayers.find(p => p.id === playerId);
		
        const playerIndex = this.players.length + 1;
        const newPlayerData = {
          player_id: playerId,
          player_name: player.player_name,
          player_display_name: player.player_display_name,
          hands_bought : 0,
          chips_bought: 0,
          amount_bought: 0,
          remaining_chips: 0,
          win_loss_chips: 0,
          win_loss_amount: 0,
          logs: []
        };
        await setDoc(doc(gameRef, 'players',`Player_${playerIndex}`), newPlayerData);
        this.players.push(newPlayerData);
      }
    },
    buyIn(player) {
      // 打开买入对话框并设置当前操作的玩家ID
      this.currentPlayerId = player.player_id;
      this.buyInDialog = true;
    },
	async fetchPlayerById(playerId) {
      // 使用Firebase Modular API查询特定player_id的玩家数据
      const gameRef = doc(db, 'games', this.currentGame.id);
      const playersRef = collection(gameRef, 'players');
      const q = query(playersRef, where('player_id', '==', playerId));
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const playerDoc = querySnapshot.docs[0];
        
          return { id: playerDoc.id, data: playerDoc.data() };
      } else {
        console.log('No player found with the given ID');
        return null;
      }
    },
    async confirmBuyIn() {
		let buyin=parseInt(this.buyInAmount, 10)
	
		
      if (this.currentPlayerId && buyin > 0) {
		 const playerResult = await this.fetchPlayerById(this.currentPlayerId);
		 console.log("playerResult:",playerResult)
         const playerData = playerResult.data;
          const playerDocId = playerResult.id;
		console.log(playerData);
		//console.log(playerDoc.exists());
        if (playerData) {
          
		     console.log(playerData);
          const newHandsBought = playerData.hands_bought*1 + buyin;
          const newChipsBought = newHandsBought * this.currentGame.chips_per_hand;
          const newAmountBought = newHandsBought * this.currentGame.amount_per_hand;
          

		   const gameRef = doc(db, 'games', this.currentGame.id);
          const playerRef = doc(collection(gameRef, 'players'), playerDocId);
          await updateDoc(playerRef, {
            hands_bought: newHandsBought,
            chips_bought: newChipsBought,
            amount_bought: newAmountBought,
            logs: arrayUnion({
              date: new Date().toLocaleString(), // 添加日期字段
              action: 'buyin',
              hands_bought: this.buyInAmount,
              timestamp: new Date().toISOString()
            })
          });

          // 更新本地数据
          const player = this.players.find(p => p.player_id === this.currentPlayerId);
          player.hands_bought = newHandsBought;
          player.chips_bought = newChipsBought;
          player.amount_bought = newAmountBought;
          
          this.buyInDialog = false;
          this.buyInAmount = 0;
        }
      }
    },
    setRemaining(player) {
      // 处理剩余逻辑
    },
    adjustLog(player) {
      // 处理调整逻辑
    },
    async fetchPlayers() {
      // 获取所有玩家列表
      const playersSnapshot = await getDocs(collection(db, 'players'));
      this.allPlayers = playersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
	async fetchInGamePlayers() {
      // 获取所有玩家列表
       const gameRef = doc(db, 'games', this.currentGame.id);
	   const InGamePlayersSnapshot=await getDocs(collection(gameRef, 'players'))
      this.InGamePlayers = InGamePlayersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  },
  created() {
    this.fetchPlayers();
  },
});
</script>

<style scoped>
.v-btn {
  margin: 10px;
}
</style>
