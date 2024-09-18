import { defineStore } from "pinia";
import { collection, getDocs, query, where } from "firebase/firestore";
import firebaseDb from "@/Lib/FirebaseDb"; // 引入 Firebase 数据库实例


const db = firebaseDb;

export const useGameStore = defineStore("gameStore", {
  state: () => ({
    games: [] as {id:string}[], // 存储当天的游戏列表
    //selectedGame: null as string|undefined|null, // 当前选中的游戏
  }),
  
  actions: {
    async fetchTodayGames() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 设置为今天的开始时间 00:00:00
        const gamesRef = collection(db, "games");
        const q = query(gamesRef, where("created_at_timestamp", ">=", today));
        const querySnapshot = await getDocs(q);

        this.games = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching today's games:", error);
      }
    },
    
    // selectGame(gameId:string) {
    //   this.selectedGame = this.games.find(game => game.id === gameId) as string|undefined;
    // },
  },
});
