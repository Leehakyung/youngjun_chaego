import type { ReactNode } from 'react'

import type { Word } from '@/types/word'

interface ExplanationPanelProps {
  word: Word
  isOpen: boolean
}

function ExplanationSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 font-body text-[11px] font-semibold tracking-[0.18em] text-tan uppercase">
        {label}
      </p>
      {children}
    </div>
  )
}

export function ExplanationPanel({ word, isOpen }: ExplanationPanelProps) {
  if (!isOpen) return null

  return (
    <div className="flex flex-col gap-4 rounded-md bg-gray-l p-4 text-left font-body text-sm text-espresso">
      <ExplanationSection label="뜻">
        <p>{word.meaning}</p>
      </ExplanationSection>

      <ExplanationSection label="정의">
        <p>{word.definition}</p>
      </ExplanationSection>

      <ExplanationSection label="예시">
        <ul className="list-disc space-y-1 pl-5">
          {word.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </ExplanationSection>

      <ExplanationSection label="힌트">
        <ul className="list-disc space-y-1 pl-5">
          {word.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      </ExplanationSection>
    </div>
  )
}
