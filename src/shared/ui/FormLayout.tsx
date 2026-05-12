import { BookOpen } from 'lucide-react'
import type { FormLayoutProps } from '../types/ui'

export default function FormLayout({
  title,
  subtitle,
  children,
}: FormLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 pb-24 sm:pb-0">
      <div className="mx-auto w-full max-w-sm rounded-3xl bg-[#FFEBD6] px-6 pt-8 pb-8 shadow-none md:max-w-md md:px-10">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-2xl">
            <BookOpen className="text-primary h-7 w-7" strokeWidth={1.8} />
          </div>
          <span className="text-primary text-2xl font-bold md:text-3xl">
            {title}
          </span>
          <p className="text-secondary text-sm md:text-base">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  )
}
