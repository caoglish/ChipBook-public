import { ref } from 'vue'
import { TTS_API_URL } from '@/config/tts'

export interface SpeechVoice {
	name: string
	lang: string
	voiceURI: string
}

export function useSpeech() {
	const isPlaying = ref(false)
	const audio = new Audio()

	const speak = async (text: string, voiceType: number = 101022) => {
		if (!text.trim()) return

		const sentences = splitText(text)

		for (const sentence of sentences) {
			if (!sentence.trim()) continue
			console.log(sentence);
			isPlaying.value = true

			try {
				const response = await fetch(TTS_API_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ text: sentence, voiceType })
				})

				if (!response.ok) {
					console.error('语音请求失败:', await response.text())
					continue
				}

				const blob = await response.blob()
				const audioUrl = URL.createObjectURL(blob)
				audio.src = audioUrl

				await playAudio(audio, audioUrl)
			} catch (error) {
				console.error('语音合成失败:', error)
			} finally {
				isPlaying.value = false
			}
		}
	}

	return {
		speak,
		isPlaying
	}
}

// 将文本按标点切句
function splitText(text: string): string[] {
	return text.split(/(?<=[。！？；,.!?])/)
}

// 播放一段音频，并等待播放结束
function playAudio(audio: HTMLAudioElement, url: string): Promise<void> {
	return new Promise((resolve) => {
		audio.onended = () => {
			URL.revokeObjectURL(url)
			resolve()
		}
		audio.onerror = () => {
			URL.revokeObjectURL(url)
			resolve()
		}
		audio.play()
	})
}
