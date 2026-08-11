interface OnboardingOptionButtonProps {
  label: string
  selected: boolean
  onSelect: () => void
}

export function OnboardingOptionButton({ label, selected, onSelect }: OnboardingOptionButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`min-h-12 w-full rounded-md border px-5 py-3 text-left font-body text-sm transition-colors duration-150 ease-out ${
        selected
          ? 'border-forest bg-sage text-espresso'
          : 'border-gray-l bg-white text-black hover:border-forest'
      }`}
    >
      {label}
    </button>
  )
}
