import {Log} from '@/Type/Log'

function makeLogDetail(item: Log) {
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

