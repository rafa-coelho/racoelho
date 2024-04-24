import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'


export default function CoverImage({
  title,
  src,
  slug,
  height,
  width,
  coverImagePriority,
}) {
  const image = (
    <Image
      src={src}
      alt={`Banner do post: ${title}`}
      className={cn('shadow-sm', {
        'hover:shadow-md transition-shadow duration-200': slug,
      }) + " rounded-lg"}
      layout="responsive"
      width={width}
      height={height}
      priority={coverImagePriority ? coverImagePriority : false}
      blurDataURL={src}
      placeholder="blur"
    />
  )
  return (
    <div className="sm:mx-0 flex items-center justify-center">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
          {image}
        </Link>
      ) : (
        <div className=' md:w-1/2'>
          {image}
        </div>
      )}
    </div>
  );
}
