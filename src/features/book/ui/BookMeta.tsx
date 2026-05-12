import { Link } from 'react-router'

interface BookMetaProps {
  title: string
  /** When null, renders the "Auteur inconnu" fallback. */
  author: string | null
  /** When null, the author is rendered as plain text (no profile link). */
  authorId: string | null
  genre: string | null
  language: string | null
  publishedDate: string | null
}

export function BookMeta({
  title,
  author,
  authorId,
  genre,
  language,
  publishedDate,
}: BookMetaProps) {
  const authorDisplay =
    author === null ? (
      <span className="italic">Auteur inconnu</span>
    ) : authorId ? (
      <Link to={`/author/${authorId}`} className="underline underline-offset-2">
        {author}
      </Link>
    ) : (
      author
    )

  return (
    <div className="space-y-0.5">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-foreground text-sm">
        {authorDisplay}
        {publishedDate && (
          <span className="text-muted-foreground"> · {publishedDate}</span>
        )}
      </p>
      <p className="text-muted-foreground text-xs">
        {genre ?? 'Genre inconnu'}
        {language && <> · {language}</>}
      </p>
    </div>
  )
}
