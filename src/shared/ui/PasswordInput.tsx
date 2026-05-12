import { EyeOff, Eye } from 'lucide-react'
import { useState } from 'react'
import type { PasswordInputProps } from '../types/ui'

export default function PasswordInput({
  name,
  value,
  onChange,
  placeholder = '••••••••',
  label,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-primary text-sm font-medium md:text-base">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="border-primary/30 text-primary placeholder:text-secondary focus:ring-accent w-full rounded-full border bg-white/80 px-4 py-2 pr-12 shadow-sm focus:ring-2 focus:outline-none md:py-3 md:text-base"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-secondary hover:text-primary absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
          aria-label={
            showPassword
              ? 'Masquer le mot de passe'
              : 'Afficher le mot de passe'
          }
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  )
}
