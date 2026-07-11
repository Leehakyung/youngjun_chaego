import { ExplanationPanel } from '@/components/ExplanationPanel'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { WordCard } from '@/components/WordCard'
import { useWordStore } from '@/store/useWordStore'

function LandingPage() {
  const currentWord = useWordStore((state) => state.currentWord)
  const isExplanationOpen = useWordStore((state) => state.isExplanationOpen)
  const pickRandomWord = useWordStore((state) => state.pickRandomWord)
  const toggleExplanation = useWordStore((state) => state.toggleExplanation)

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />

      <main className="mx-auto flex w-full max-w-[600px] flex-1 flex-col gap-6 px-6 py-10">
        <WordCard word={currentWord} />

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={pickRandomWord}
            className="min-h-12 rounded-sm bg-forest px-7 py-3 font-body text-xs font-semibold tracking-[0.12em] text-lime uppercase transition-colors duration-150 ease-out hover:bg-espresso"
          >
            랜덤 단어 뽑기
          </button>

          <button
            type="button"
            onClick={toggleExplanation}
            disabled={!currentWord}
            className="min-h-12 rounded-sm border border-black px-7 py-3 font-body text-xs font-semibold tracking-[0.12em] text-black uppercase transition-colors duration-150 ease-out hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
          >
            설명 도와줘
          </button>
        </div>

        {currentWord ? <ExplanationPanel isOpen={isExplanationOpen} word={currentWord} /> : null}
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage
