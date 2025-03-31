import { useSpeech } from '@/composables/useSpeech'
import { PlayerInGame } from '@/Type/Player'
function isAllEnglish(str: string): boolean {
	return /^[A-Za-z\s]+$/.test(str)
}
export function voiceReportList(players: PlayerInGame[]) {
	const { speak } = useSpeech()
  
	// 1. 按 hands_bought 倒序排序
	const sorted = [...players].sort((a, b) => b.hands_bought - a.hands_bought)
  
	// 2. 过滤出 hands_bought > 1 的玩家
	const filtered = sorted.filter(player => player.hands_bought > 1)
  
	// 3. 播报这些玩家
	for (const player of filtered) {
	  const message = textReport(player)
	  speak(message, { lang: 'zh-CN', rate: 1 })
	}
  
	// 4. 如果过滤后的人数少于总人数，再播报“其余人都只有一手”
	if (filtered.length < players.length) {
	  speak('其余人都只有一手', { lang: 'zh-CN', rate: 1 })
	}
}

function  textReport(player: PlayerInGame) {
	let message = ''

	if (player.hands_bought === 1) {
		message = `${player.player_display_name} 未买筹码，一共 ${player.hands_bought} 手筹码`
	} else {
		const bought = player.hands_bought - 1
		message = `${player.player_display_name} 买了 ${bought} 手筹码，一共 ${player.hands_bought} 手筹码`
	}

	return message
}
export function voiceReport(player: PlayerInGame) {
	const { speak } = useSpeech()

	const message=textReport(player)

	speak(message, {
		lang: 'zh-CN',
		rate: 1,
	})
}