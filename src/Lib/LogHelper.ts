import type { Log } from '@/Type/Log'
import { ActionEnum } from '@/Type/Log'
import {

	arrayUnion,
} from "firebase/firestore";
import { dateDisplay, firebaseTimestamp } from "@/Lib/DateHelper";


function makeLogDetail(item: Log) {
	const actionsSet = new Set([ActionEnum.JOIN, ActionEnum.BUYIN]);
	return {
		'remaining chips': item.action == ActionEnum.SETREMAINING ? item.chips : undefined,
		'buy in': actionsSet.has(item.action) ? item.hands : undefined,
		'refund hands': item.action == ActionEnum.REFUND ? item.hands : undefined
	}
}

export function createLogEntryForFirebase(action: ActionEnum, actionNumber: number) {
	console.log(action, actionNumber);
	return arrayUnion({
		date: dateDisplay(),
		action,
		[action === ActionEnum.SETREMAINING ? 'chips' : 'hands']: actionNumber,
		timestamp: firebaseTimestamp()
	});
}

export function makeTimelineDetail(item: Log) {
	const colorMap: Record<ActionEnum, string> = {
		[ActionEnum.JOIN]: "teal-lighten-2",
		[ActionEnum.BUYIN]: "red-lighten-1",
		[ActionEnum.REFUND]: "yellow-darken-1",
		[ActionEnum.SETREMAINING]: "blue-lighten-1"
	};


	const actionTextMap: Record<ActionEnum, string> = {
		[ActionEnum.JOIN]: "加入",
		[ActionEnum.BUYIN]: "买入",
		[ActionEnum.REFUND]: "退码",
		[ActionEnum.SETREMAINING]: "剩余筹码"
	};

	const noteMap: Record<ActionEnum, string> = {
		[ActionEnum.JOIN]: `买入 ${item.hands ?? 0} 手`,
		[ActionEnum.BUYIN]: `买入 ${item.hands ?? 0} 手`,
		[ActionEnum.REFUND]: `退码 ${item.hands ?? 0} 手`,
		[ActionEnum.SETREMAINING]: `剩余 ${item.chips ?? 0} 筹码`
	};

	const iconMap: Record<ActionEnum, string> = {
		[ActionEnum.JOIN]: "mdi-account-plus", // Vuetify 加入图标
		[ActionEnum.BUYIN]: "mdi-cash-plus", // 资金增加图标
		[ActionEnum.REFUND]: "mdi-cash-refund", // 资金退还图标
		[ActionEnum.SETREMAINING]: "mdi-poker-chip", // 筹码图标
	};


	return {
		...item,
		color: colorMap[item.action],
		actionText: actionTextMap[item.action],
		note: noteMap[item.action],
		icon: iconMap[item.action]
	};


}

export default {
	makeLogDetail, createLogEntryForFirebase
}

