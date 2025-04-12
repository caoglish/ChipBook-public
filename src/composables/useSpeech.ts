// useSpeech.ts
import { ref, onMounted } from 'vue'
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

		isPlaying.value = true

		try {
			const response = await fetch(TTS_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text, voiceType })
			})

			if (!response.ok) {
				throw new Error('语音请求失败')
			}

			const blob = await response.blob()
			const audioUrl = URL.createObjectURL(blob)
			audio.src = audioUrl
			audio.play()

			audio.onended = () => {
				isPlaying.value = false
				URL.revokeObjectURL(audioUrl)
			}

			audio.onerror = () => {
				isPlaying.value = false
				URL.revokeObjectURL(audioUrl)
			}

		} catch (error) {
			console.error('语音合成失败:', error)
			isPlaying.value = false
		}
	}

	return {
		speak,
		isPlaying
	}
}
