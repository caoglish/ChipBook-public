// Import the Firebase Timestamp type
import { Timestamp } from 'firebase/firestore';


export enum ActionEnum{
	BUYIN = 'buyin',
	REFUND = 'refund',
	SETREMAINING = 'setRemaining',
	JOIN = 'join'
}

  export type LogForDisplay =  Log &{
	player_display_name:string;
	player_id:string;
	details:{
	'remaining chips': number|undefined,
	'buy in': number|undefined,
	'refund hands':  number|undefined,
}}

export type Log = {
	action:  ActionEnum; // Include all possible actions
	chips?: number; // 可选字段
	hands?: number; // 可选字段
	date: Date; // Date in string format, e.g., "2024/09/14, 21:25:46"
	timestamp: Timestamp; // Timestamp stored as a Date object
  }