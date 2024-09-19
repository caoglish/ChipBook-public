import { defineStore } from 'pinia';
import firebaseDb from "@/Lib/FirebaseDb";// 确保 Firebase 正确导入
import { doc ,getDoc} from 'firebase/firestore';

// 使用 `pinia-plugin-persistedstate` 插件来持久化状态
export const useCurrentGameIdStore = defineStore('currentGameIdStore', {
	state: () => ({
		currentGameId: null as string | null, // 保存当前游戏的 ID
	}),
	actions: {
		async checkGameSessionInFirebase(): Promise<boolean> {
			try {
				const gameId=this.currentGameId as string;
			
				const gameRef = doc(firebaseDb, "games", gameId);
				const gameSnapshot = await getDoc(gameRef);
				
				if (gameSnapshot.exists()) {

					return true; // 存在此游戏 session
				} else {
					this.currentGameId = null; // 没有找到则清空当前 session
					return false; // 不存在此游戏 session
				}
			} catch (error) {
				console.error('Error checking game session in Firebase:', error);
				return false; // 查询出错，返回 false
			}
		},
		setGameId(id: string) {
			this.currentGameId = id; // 设置当前游戏的 ID
		},
		clearGameId() {
			this.currentGameId = null; // 清除当前游戏的 ID
		},
	},
	persist: true, // 使用持久化插件
});
