import { useSpeech } from '@/composables/useSpeech'
import type { PlayerInGame } from '@/Type/Player'
// function isAllEnglish(str: string): boolean {
// 	return /^[A-Za-z\s]+$/.test(str)
// }
export async function voiceReportList(players: PlayerInGame[]) {
	const { speak, isPlaying } = useSpeech()

	// 1. 按 hands_bought 倒序排序
	const sorted = [...players].sort((a, b) => b.hands_bought - a.hands_bought)

	// 2. 过滤出 hands_bought > 1 的玩家
	const filtered = sorted.filter(player => player.hands_bought > 1)

	// 3. 创建一个队列顺序播放
	const messages: string[] = filtered.map(player => textReport(player))
	if (filtered.length < players.length) {
		messages.push('其余人都只有一手')
	}

	const fullMessage = messages.join('。') + '。'

	await speak(fullMessage)


	// for (const message of messages) {
	// 	await waitUntilIdle(isPlaying) // 等待上一个播放完成
	// 	await speakWithAwait(speak, message)
	// }


}

function textReport(player: PlayerInGame) {
	let message = ''

	if (player.hands_bought === 1) {
		message = `${player.player_display_name} 未买筹码，一共 ${player.hands_bought} 手筹码`
	} else {
		const bought = player.hands_bought - 1
		message = `${player.player_display_name} 买了 ${bought} 手筹码，一共 ${player.hands_bought} 手筹码`
	}

	return message
}
export async function voiceReport(player: PlayerInGame) {
	const { speak } = useSpeech()

	const message = textReport(player)

	await speak(message)
}


// 等待语音播放结束
// function waitUntilIdle(isPlayingRef: Ref<boolean>) {
// 	return new Promise<void>((resolve) => {
// 		const check = () => {
// 			if (!isPlayingRef.value) {
// 				resolve()
// 			} else {
// 				setTimeout(check, 50)
// 			}
// 		}
// 		check()
// 	})
// }

// // 包装 speak() 以等待播放结束
// function speakWithAwait(speak: (text: string) => Promise<void>, text: string) {
// 	return new Promise<void>(async (resolve) => {
// 		await speak(text)
// 		// 假设 speak 本身不等结束播放，我们靠 waitUntilIdle 保证顺序
// 		setTimeout(resolve, 10) // 可选：等下一轮 check 更顺滑
// 	})
// }