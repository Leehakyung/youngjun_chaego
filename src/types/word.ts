export type WordLevel = 1 | 2 | 3 | 4 | 5

export interface Word {
  id: number
  word: string
  english: string
  category: string
  level: WordLevel
  meaning: string
  definition: string
  examples: string[]
  hints: string[]
  questions?: string[]
}

export interface WordData {
  words: Word[]
}
