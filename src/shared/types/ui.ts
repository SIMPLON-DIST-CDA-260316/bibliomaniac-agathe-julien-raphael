import type { ChangeEvent, ReactNode } from 'react'

export interface FormLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export interface TextInputProps {
  name: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label?: string
}

export interface PasswordInputProps {
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label?: string
}
