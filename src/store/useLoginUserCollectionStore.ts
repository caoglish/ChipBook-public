/**
 * 管理数据库表名：login_user_collection
 */
import { defineStore } from 'pinia';
import type { User } from '@/Type/User';
import { dateDisplay, firebaseTimestamp } from "@/Lib/DateHelper";
import {
	getDoc,
	doc,
	setDoc,
	updateDoc,
	collection, getDocs, orderBy, query
} from "firebase/firestore";
import firebaseDb from "@/Lib/FirebaseDb";

const LOGIN_USER_COLLECTION_NAME = "loginUsers";

export const useLoginUserCollectionStore = defineStore('useLoginUserCollectionStore', {
	state: () => ({
		users: [] as object[],
	}),

	actions: {
		async fetchUsers() {
			console.log("fetchUsers")
			try {
				const db = firebaseDb;
				//const q = query(collection(db, 'LoginUsers'), orderBy('createdAt', 'desc'))
				const q = collection(db, LOGIN_USER_COLLECTION_NAME)
				const querySnapshot = await getDocs(q)

				this.users = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}))
				console.log("fetchUsers", this.users)
			} catch (error) {
				console.error('获取 LoginUsers 失败:', error)
			}
		},
		async getLoginUserFromCollection(userId: string) {
			try {
				const db = firebaseDb;
				const userRef = doc(db, LOGIN_USER_COLLECTION_NAME, userId);
				const userSnap = await getDoc(userRef);
				console.log("getLoginUserFromCollection", userId, userSnap.exists())
				if (userSnap.exists()) {
					console.log("getLoginUserFromCollection", userSnap.data(), userId)
					return userSnap.data();
				} else {
					console.error('User not found');
					return null;
				}
			} catch (error) {
				console.error('Error fetching loginUser:', error);
				return null;
			}
		},
		async createUserIfNotExists(user: User) {
			try {
				const db = firebaseDb;

				const userRef = doc(db, LOGIN_USER_COLLECTION_NAME, user.uid!);
				const userDoc = await getDoc(userRef);

				if (!userDoc.exists()) {
					// 用户文档不存在，创建新文档
					await setDoc(userRef, {
						uid: user.uid,
						email: user.email,
						displayName: user.displayName || "Anonymous",
						createdAt: dateDisplay(),
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
	},
});
