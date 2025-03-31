// useSpeech.ts
import { ref, onMounted } from 'vue'

export interface SpeechVoice {
  name: string
  lang: string
  voiceURI: string
}

export function useSpeech(defaultLang = 'zh-CN') {
  const voices = ref<SpeechVoice[]>([])

  const loadVoices = () => {
    voices.value = window.speechSynthesis.getVoices().map((voice) => ({
      name: voice.name,
      lang: voice.lang,
      voiceURI: voice.voiceURI
    }))
  }

  const speak = (
    text: string,
    options?: {
      voiceName?: string
      rate?: number
      pitch?: number
      volume?: number
      lang?: string
    }
  ) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options?.lang || defaultLang
    utterance.rate = options?.rate ?? 1
    utterance.pitch = options?.pitch ?? 1
    utterance.volume = options?.volume ?? 1

    if (options?.voiceName) {
      const selectedVoice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.name === options.voiceName)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
    }

    window.speechSynthesis.speak(utterance)
  }

  onMounted(() => {
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  })

  return {
    speak,
    voices
  }
}
