import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  children: ReactNode
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-md border border-gray-l bg-white p-8">
      <h1 className="font-display text-2xl font-semibold tracking-[-0.015em] text-black">{title}</h1>
      {children}
    </div>
  )
}
