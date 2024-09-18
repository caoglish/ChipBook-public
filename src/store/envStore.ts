import { defineStore } from 'pinia';

// @ is an alias to /src
import firebaseDb from "@/Lib/FirebaseDb";
import { collection, getDocs } from "firebase/firestore";
const db = firebaseDb;

const querySnapshot = await getDocs(collection(db, "info"));
export const useEnvStore = defineStore('envStore', {
	state: () => ({
		env: null as string | null,
	}),
	actions: {
		async loadEnv(): Promise<void> {
			try {
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
