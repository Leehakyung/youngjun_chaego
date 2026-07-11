import type { Word } from '@/types/word'

interface WordCardProps {
  word: Word | null
}

function levelStars(level: Word['level']): string {
  return '⭐'.repeat(level) + '☆'.repeat(5 - level)
}

export function WordCard({ word }: WordCardProps) {
  if (!word) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-md border border-gray-l bg-white p-8 text-center">
        <p className="font-body text-base text-espresso">
          아래 버튼을 눌러 첫 단어를 뽑아보세요
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-md border border-gray-l bg-white p-8 text-center">
      <span className="rounded-full bg-mint px-3 py-1 font-body text-[10px] font-semibold tracking-[0.14em] text-forest uppercase">
        {word.category}
      </span>
      <h2 className="font-display text-5xl font-bold tracking-[-0.02em] text-black">
        {word.word}
      </h2>
      <p className="font-body text-sm text-tan">{word.english}</p>
      <p aria-label={`난이도 ${word.level} / 5`} className="text-lg leading-none">
        {levelStars(word.level)}
      </p>
    </div>
  )
}
