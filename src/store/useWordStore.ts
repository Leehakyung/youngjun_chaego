import { create } from 'zustand'

import { words } from '@/data/words'
import type { Word } from '@/types/word'

interface WordStore {
  currentWord: Word | null
  isExplanationOpen: boolean
  pickRandomWord: () => void
  toggleExplanation: () => void
}

function pickDifferentWord(currentWord: Word | null): Word {
  let next = words[Math.floor(Math.random() * words.length)]
  while (currentWord && words.length > 1 && next.id === currentWord.id) {
    next = words[Math.floor(Math.random() * words.length)]
  }
  return next
}

export const useWordStore = create<WordStore>((set, get) => ({
  currentWord: null,
  isExplanationOpen: false,
  pickRandomWord: () => {
    set({ currentWord: pickDifferentWord(get().currentWord), isExplanationOpen: false })
  },
  toggleExplanation: () => set((state) => ({ isExplanationOpen: !state.isExplanationOpen })),
}))
