import { defineStore } from 'pinia';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import firebaseDb from '@/Lib/FirebaseDb';
import { Player } from '@/Type/Player'; // 确保你有一个类型定义文件来定义 Player 接口


const db = firebaseDb;

export const usePlayerStore = defineStore('playerStore', {
	// State: 管理玩家数据的状态
	state: () => ({
		players: [] as Player[], // 存储玩家列表
	}),

	// Getters: 获取处理后的数据
	getters: {
		getPlayerById: (state) => {
			return (id: string) => state.players.find(player => player.id === id);
		},
		// 根据allow_select过滤出可供选择的玩家列表
		ForSelectPlayerList(state): Player[] {
			return state.players.filter(player => player.allow_select);
		},

		// 根据allow_select过滤出不允许选择的玩家列表
		NotForSelectPlayerList(state): Player[] {
			return state.players.filter(player => !player.allow_select);
		},
	},

	// Actions: 用于修改状态的方法
	actions: {
		async fetchPlayers() {
			try {
				const playersCol = collection(db, 'players');
				const playerSnapshot = await getDocs(playersCol);
				this.players = playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));

			} catch (error) {
				console.error('Error fetching players:', error);
				alert('无法加载玩家列表，请重试。');
			}
		},
		// 切换玩家的allow_select状态
		async toggleAllowSelect(playerId: string) {
			const player = this.players.find(p => p.id === playerId);
			if (player) {
				player.allow_select = !player.allow_select;
				// 更新Firebase中的allow_select字段
				const playerRef = doc(firebaseDb, 'players', player.id);
				await updateDoc(playerRef, { allow_select: player.allow_select });
			}
		},

		async addPlayer(newPlayer: Player) {
			
			try {
				newPlayer.allow_select=true;
				const playersCol = collection(db, 'players');
				await addDoc(playersCol, newPlayer);
				this.fetchPlayers(); // 重新获取玩家列表以更新视图
			} catch (error) {
				console.error('Error adding player:', error);
				alert('无法添加玩家，请重试。');
			}
		},

		async updatePlayer(playerId: string, updatedData: Partial<Player>) {
			try {
				const playerRef = doc(db, 'players', playerId);
				await updateDoc(playerRef, updatedData);
				this.fetchPlayers(); // 重新获取玩家列表以更新视图
			} catch (error) {
				console.error('Error updating player:', error);
				alert('无法更新玩家，请重试。');
			}
		},

		async deletePlayer(playerId: string) {
			try {
				const playerRef = doc(db, 'players', playerId);
				await deleteDoc(playerRef);
				this.fetchPlayers(); // 重新获取玩家列表以更新视图
			} catch (error) {
				console.error('Error deleting player:', error);
				alert('无法删除玩家，请重试。');
			}
		},
	},
});