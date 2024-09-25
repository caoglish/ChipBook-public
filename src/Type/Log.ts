// Import the Firebase Timestamp type
import { Timestamp } from 'firebase/firestore';

  export type LogForDisplay =  Log &{
	player_display_name:string;
	player_id:string;
	details:{
	'remaining chips': number|undefined,
	'buy in': number|undefined,
	'refund hands':  number|undefined,
}}

export type Log = {
	action:  'buyin' | 'refund' | 'setRemaining' | 'join'; // Include all possible actions
	chips?: number; // 可选字段
	hands?: number; // 可选字段
	date: Date; // Date in string format, e.g., "2024/09/14, 21:25:46"
	timestamp: Timestamp; // Timestamp stored as a Date object
  }