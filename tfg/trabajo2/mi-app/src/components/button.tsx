import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  className?: string
}

export default function Button({ children, className = '' }: ButtonProps) {
  return (
    <span
      className={`inline-block bg-[#ab5dc1] text-white text-lg font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-purple-500/50   ${className}`}
    >
      {children}
    </span>
  )
}
