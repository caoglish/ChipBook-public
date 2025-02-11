import { defineStore } from 'pinia';

// @ is an alias to /src
import firebaseDb from "@/Lib/FirebaseDb";
import { collection, getDocs } from "firebase/firestore";
const db = firebaseDb;


export const useEnvStore = defineStore('useEnvStore', {
	state: () => ({
		env: null as string | null,
	}),
	actions: {
		async loadEnv(): Promise<void> {
			try {
				const querySnapshot = await getDocs(collection(db, "info"));
				querySnapshot.forEach((doc) => {
					const post = doc.data();
					console.log(post);
					this.env = post.env;
				})
			} catch (error) {
				console.error('Error checking game env in Firebase:', error);
			}
		}
	}
});
