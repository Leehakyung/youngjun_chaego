import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function TextField({ label, id, name, className = '', ...props }: TextFieldProps) {
  const inputId = id ?? name

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label
        htmlFor={inputId}
        className="font-body text-[11px] font-semibold tracking-[0.14em] text-espresso uppercase"
      >
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={`min-h-12 rounded-md border border-gray-l bg-white px-4 py-3 font-body text-sm text-black outline-none transition-colors duration-150 ease-out focus:border-forest ${className}`}
        {...props}
      />
    </div>
  )
}
