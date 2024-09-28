import { defineStore } from 'pinia';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import firebaseDb from '@/Lib/FirebaseDb';
import { dateDisplay } from '@/Lib/DateHelper';

const db = firebaseDb;

export const useHistoryStore = defineStore('historyStore', {
  state: () => ({
    games: [] as Array<any>, // 游戏列表
    loading: false, // 加载状态
    showDeleteAlert: false, // 删除成功提示
  }),

  actions: {
    async fetchAllGames() {
      if (this.loading) return; // 防止多次请求
      this.loading = true;

      try {
        const gamesRef = collection(db, 'games');
        const querySnapshot = await getDocs(gamesRef);
        const gameDataPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const gameId = doc.id;

          // 获取 players 子集合中的文档数量
          const playersRef = collection(db, `games/${gameId}/players`);
          const playersSnapshot = await getDocs(playersRef);
          const playerCount = playersSnapshot.size;

          return {
            id: gameId,
            created_at: dateDisplay(new Date(data.created_at)),
            sortfield: new Date(data.created_at),
            player_count: playerCount,
            chips_per_hand: data.chips_per_hand,
            amount_per_hand: data.amount_per_hand,
            summary: data.hasOwnProperty('summary'),
          };
        });

		

        const games = await Promise.all(gameDataPromises);
        this.games = games.sort((a, b) => b.sortfield.valueOf() - a.sortfield.valueOf());
      } catch (error) {
        console.error('Error fetching all games:', error);
        alert('无法加载游戏历史，请重试。');
      } finally {
        this.loading = false;
      }
    },

    async deleteGame(gameId: string) {
      try {
        const gameRef = doc(db, 'games', gameId);
        await deleteDoc(gameRef);
        this.games = this.games.filter((game) => game.id !== gameId);
        this.showDeleteAlert = true;

        // 自动隐藏提示
        setTimeout(() => {
          this.showDeleteAlert = false;
        }, 3000);
      } catch (error) {
        console.error('Error deleting game:', error);
        alert('删除游戏记录时出错，请重试。');
      }
    },
  },
});
