/**
 * 用于管理用户登录状态的 Pinia Store
 * 该 Store 用于处理用户登录、登出、检查登录状态等操作
 * 
 *  */
import { defineStore } from 'pinia';
import { firebaseAuth } from "@/Lib/FirebaseDb";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from '@/Type/User';
import { useLoginUserCollectionStore } from '@/store/useLoginUserCollectionStore';

export const useLoginUserStore = defineStore('useLoginUserStore', {
	state: () => ({
		user: null as User | null,
		errorMessage: null as string | null,
	}),
	getters: {
		isAuthenticated: (state) => !!state.user,
	},
	// 使用持久化选项
	persist: true,

	actions: {

		// 使用 Google 登录
		async signInWithGoogle() {
			const provider = new GoogleAuthProvider();
			try {
				const result = await signInWithPopup(firebaseAuth, provider);
				const user = result.user;

				// 检查用户的电子邮件是否存在
				//if (user.email && user.email.includes("cao")) {
				if (user.email) {
					// 登录成功且电子邮件地址在允许的列表中
					this.user = {
						email: user.email,
						displayName: user.displayName,
						uid: user.uid,
					};
					this.errorMessage = null;
				} else {
					// 用户的电子邮件地址不被允许
					this.errorMessage = "您没有权限访问此应用。";
					await this.signOut(); // 使用 signOut 方法退出当前用户
				}
			} catch (error) {
				this.errorMessage = "登录失败，请重试。";
				console.error("Error during Google sign-in:", error);
			}
		},

		// 登出用户
		async signOut() {
			try {
				await signOut(firebaseAuth);
				this.user = null; // 清空用户数据
			} catch (error) {
				console.error("Error during sign-out:", error);
			}
		},

		// 检查用户的登录状态
		checkAuthState() {
			const LoginUserCollectionStore = useLoginUserCollectionStore();
			onAuthStateChanged(firebaseAuth, async (user) => {
				if (user && user.email) {
					this.user = {
						email: user.email,
						displayName: user.displayName,
						uid: user.uid,
					};
					await LoginUserCollectionStore.createUserIfNotExists(this.user);
				} else {
					this.user = null;
				}
			});
		},
	},
});
