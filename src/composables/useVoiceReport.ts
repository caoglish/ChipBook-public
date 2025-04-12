import { useSpeech } from '@/composables/useSpeech'
import type { PlayerInGame } from '@/Type/Player'
import { useGameStore } from '@/store/useGameStore'
import _ from "lodash"
// function isAllEnglish(str: string): boolean {
// 	return /^[A-Za-z\s]+$/.test(str)
// }
export async function voiceReportList(players: PlayerInGame[]) {
	const { speak, isPlaying } = useSpeech()
	const gameStore = useGameStore()
	const isWinLossCalculated = gameStore.isWinLossCalculated;
	// 1. 按 hands_bought 倒序排序
	const sorted = [...players].sort((a, b) => b.hands_bought - a.hands_bought)

	// 2. 过滤出 hands_bought > 1 的玩家
	let messages: string[] = [];

	if (!isWinLossCalculated) {
		const filtered = sorted.filter(player => player.hands_bought > 1)
		// 3. 创建一个队列顺序播放
		messages = filtered.map(player => textReport(player))
		if (filtered.length < players.length) {
			messages.push('其余人都只有一手.')
		}
	} else {
		messages = sorted.map(player => textReport(player))

	}
	console.log(messages)




	const fullMessage = messages.join('')
	console.log(fullMessage)

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

	if (!_.isNull(player.remaining_chips) && player.remaining_chips >= 0) {
		message += `，手上剩余${player.remaining_chips}筹码。`
	} else {
		message += `。`
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