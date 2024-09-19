// store/useLogStore.ts
import { defineStore } from 'pinia';
import { collection, getDocs, doc } from 'firebase/firestore';
import firebaseDb from '@/Lib/FirebaseDb';
import logHelper from '@/Lib/LogHelper';
import {Log} from '@/Type/Log'
import {PlayerInGame} from '@/Type/Player'

const db = firebaseDb;

export const useLogStore = defineStore('logStore', {
  state: () => ({
    combinedLogs: [] as Array<Log>,
    sortByPlayer: false,
  }),
  actions: {
    async fetchAllPlayerLogs(gameId: string) {
      try {
        const gameRef = doc(db, "games", gameId);
        const playersSnapshot = await getDocs(collection(gameRef, "players"));
        const allplayers = playersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PlayerInGame[];

        const allLogs = allplayers.reduce((accumulator: Log[] , currentPlayer:PlayerInGame) => {
          const logs = currentPlayer.logs.map((item: any) => ({
            ...item,
            player_display_name: currentPlayer.player_display_name,
            player_id: currentPlayer.player_id,
            details: logHelper.makeLogDetail(item),
          }));
          return accumulator.concat(logs);
        }, [] as Array<any>);

        this.combinedLogs = allLogs;
        this.sortLogs();
      } catch (error) {
        console.error("Error fetching all player logs:", error);
      }
    },
    sortLogs() {
      if (this.sortByPlayer) {
        this.combinedLogs.sort((a:Log, b:Log) => {
          if (a.player_id === b.player_id) {
            return a.timestamp.seconds - b.timestamp.seconds;
          }
          return a.player_id.localeCompare(b.player_id);
        });
      } else {
        this.combinedLogs.sort((a:Log, b:Log) => a.timestamp.seconds - b.timestamp.seconds);
      }
    },
    sortLogsByPlayer() {
      this.sortByPlayer = true;
      this.sortLogs();
    },
    sortLogsByTime() {
      this.sortByPlayer = false;
      this.sortLogs();
    }
  }
});
