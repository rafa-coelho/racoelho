import Avatar from '../Image/Avatar'
import DateFormatter from '../Utils/DateFormatter'
import CoverImage from '../Image/CoverImage'
import Link from 'next/link'
import * as gtag from '../../lib/gtag'

export default function PostPreview ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <div>
      <div className="mb-5">
        <CoverImage
          slug={slug}
          title={title}
          src={coverImage}
          height={278}
          width={556}
        />
      </div>
      <h3 className="text-2xl lg:text-2xl mb-1 leading-snug">
        <Link
          as={`/posts/${slug}`}
          href="/posts/[slug]"
          className="hover:underline"
          onClick={() => {
            gtag.event({
              action: 'post_click',
              category: 'Navigation',
              label: slug,
              value: 1,
            })
          }}
        >
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>

      {
        excerpt && (
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
        )
      }

      {
        author && (
          <Avatar name={author.name} picture={author.picture} />
        )
      }
    </div>
  );
}
