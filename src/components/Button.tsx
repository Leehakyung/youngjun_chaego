import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-forest text-lime hover:bg-espresso disabled:hover:bg-forest',
  secondary:
    'border border-black text-black hover:bg-black hover:text-white disabled:hover:bg-transparent disabled:hover:text-black',
}

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`min-h-12 rounded-sm px-7 py-3 font-body text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-40 ${variantClass[variant]} ${className}`}
      {...props}
    />
  )
}
