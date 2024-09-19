// Import the Firebase Timestamp type
import { Timestamp } from 'firebase/firestore';

export type Log = {
	player_display_name:string;
	player_id:string;
	action: 'buyin' | 'refund' | 'setRemaining' | 'join'; // Include all possible actions
	date: string; // Date in string format, e.g., "2024/09/14, 21:25:46"
	hands?: string; // Optional property: Hands as a string, e.g., "1" or undefined
	chips?: string; // Optional property: Chips as a string or undefined
	timestamp: Timestamp; // Timestamp stored as a Date object
  };