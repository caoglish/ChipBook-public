interface Item {
	action: string;
	chips?: number; // 可选字段
	hands?: number; // 可选字段
	date: Date;
  }
function makeLogDetail(item: Item) {
	const actionsSet = new Set(['join', 'buyin']);
	return {
		'remaining chips': item.action == 'setRemaining' ? item.chips : undefined,
		'buy in': actionsSet.has(item.action) ? item.hands : undefined,
	
		'refund hands': item.action == 'refund' ? item.hands : undefined
	}
}

export default {
	makeLogDetail
}

