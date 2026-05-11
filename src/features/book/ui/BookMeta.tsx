import { Link } from 'react-router'

interface BookMetaProps {
  title: string
  author: string
  /** When null, the author is rendered as plain text (no profile link). */
  authorId: string | null
  genre: string | null
  publishedDate: string | null
}

export function BookMeta({
  title,
  author,
  authorId,
  genre,
  publishedDate,
}: BookMetaProps) {
  return (
    <div className="space-y-0.5">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-foreground text-sm">
        {authorId ? (
          <Link
            to={`/author/${authorId}`}
            className="underline underline-offset-2"
          >
            {author}
          </Link>
        ) : (
          author
        )}
        {publishedDate && (
          <span className="text-muted-foreground"> · {publishedDate}</span>
        )}
      </p>
      {genre && <p className="text-muted-foreground text-xs">{genre}</p>}
    </div>
  )
}
