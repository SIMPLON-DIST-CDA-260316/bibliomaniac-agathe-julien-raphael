import type { ChangeEvent } from 'react'

interface TextInputProps {
  name: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label?: string
}

export default function TextInput({
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-primary text-sm font-medium md:text-base">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border-primary/30 text-primary placeholder:text-secondary focus:ring-accent w-full rounded-full border bg-white/80 px-4 py-2 shadow-sm focus:ring-2 focus:outline-none md:py-3 md:text-base"
      />
    </div>
  )
}
