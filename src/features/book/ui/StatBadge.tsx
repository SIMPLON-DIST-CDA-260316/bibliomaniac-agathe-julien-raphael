interface StatBadgeProps {
  label: string
  value: string
}

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className="bg-emphasis text-emphasis-foreground flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5">
      <span className="text-sm italic opacity-80">{label}</span>
      <span className="text-lg">{value}</span>
    </div>
  )
}
