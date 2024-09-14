<template>
  <div>
    <h2>游戏历史记录</h2>
    <v-data-table :headers="historyHeaders" :items="games" class="mt-4">
     <template #item.actions="{ item }">
        <v-btn color="primary" @click="viewGame(item.id)">查看</v-btn>
      </template>
      <template #item.created_at="{ item }">
        <span>{{item.created_at }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { collection, getDocs } from "firebase/firestore";
import firebaseDb from "@/Lib/FirebaseDb";

const db = firebaseDb;

export default defineComponent({
  name: "History",
  data() {
    return {
      games: [], // 所有游戏的列表
      historyHeaders: [
        { title: "游戏ID", key: "id" },
        { title: "创建时间", key: "created_at" },
        { title: "玩家数量", key: "player_count" },
        { title: "每手筹码", key: "chips_per_hand" },
        { title: "每手金额", key: "amount_per_hand" },
        { title: "操作", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    async fetchAllGames() {
      try {
        const gamesRef = collection(db, "games");
        const querySnapshot = await getDocs(gamesRef);
        const gameDataPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const gameId = doc.id;

          // 获取players子集合中的文档数量
          const playersRef = collection(db, `games/${gameId}/players`);
          const playersSnapshot = await getDocs(playersRef);
          const playerCount = playersSnapshot.size; // 子集合中文档的数量


          return {
            id: gameId,
            created_at: data.created_at,
			sortfield: new Date(data.created_at),
            player_count: playerCount,
            chips_per_hand: data.chips_per_hand,
            amount_per_hand: data.amount_per_hand,
          };
        });

         // 等待所有Promise完成后排序
        const games = await Promise.all(gameDataPromises);

        // 按创建时间排序（最新的在前）
        this.games = games.sort((a, b) => b.sortfield - a.sortfield);
      } catch (error) {
        console.error("Error fetching all games:", error);
        alert("无法加载游戏历史，请重试。");
      }
    },
	//  formatDate(date) {
    //   if (!date) return '';
    //   // 使用Intl.DateTimeFormat格式化日期
    //   return new Intl.DateTimeFormat('zh-CN', {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit',
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit'
    //   }).format(date);
    // },
    viewGame(gameId) {
      // 跳转到GameManagement页面，并传递gameId
      this.$router.push({ name: "GameManagement", params: { gameId } });
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
