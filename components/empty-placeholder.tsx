interface EmptyPlaceholderProps {
  title: string
  description: string
}

export function EmptyPlaceholder({ title, description }: EmptyPlaceholderProps) {
  return (
    <div className="flex h-[200px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

