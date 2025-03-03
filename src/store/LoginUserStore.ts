import { defineStore } from 'pinia';
import { firebaseAuth } from "@/Lib/FirebaseDb";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { User } from '@/Type/User';
import { dateDisplay, firebaseTimestamp } from "@/Lib/DateHelper";
import {
	getDoc,
	doc,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import firebaseDb from "@/Lib/FirebaseDb";

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
		async createUserIfNotExists(user: User) {
			try {
				const db = firebaseDb;
				
			  const userRef = doc(db, "loginUsers", user.uid!);
			  const userDoc = await getDoc(userRef);
		  
			  if (!userDoc.exists()) {
				// 用户文档不存在，创建新文档
				await setDoc(userRef, {
				  uid: user.uid,
				  email: user.email,
				  displayName: user.displayName || "Anonymous",
				  createdAt:dateDisplay(),
				  lastLogin: dateDisplay(),
				  
				});
				console.log("新用户文档已创建");
			  } else {
				console.log("用户文档已存在");
				// 可选：更新最后登录时间
				await updateDoc(userRef, { lastLogin: dateDisplay() });
			  }
			} catch (error) {
			  console.error("用户文档操作失败:", error);
			}
		  },
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
			onAuthStateChanged(firebaseAuth, (user) => {
				if (user && user.email && user.email.includes("cao")) {
					this.user = {
						email: user.email,
						displayName: user.displayName,
						uid: user.uid,
					};
					this.createUserIfNotExists(this.user);
				} else {
					this.user = null;
				}
			});
		}
	},
});
