interface Item {
	action: string;
	chips?: number; // 可选字段
	hands?: number; // 可选字段
	date: Date;
  }
function makeLogDetail(item: Item) {
	return {
		'remaining chips': item.action == 'setRemaining' ? item.chips : undefined,
		'buy in': item.action == 'buyin' ? item.hands : undefined,
		'refund hands': item.action == 'refund' ? item.hands : undefined
	}
}

export default {
	makeLogDetail
}