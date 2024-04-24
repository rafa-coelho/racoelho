import Avatar from '../Image/Avatar'
import CoverImage from '../Image/CoverImage'
import DateFormatter from '../Utils/DateFormatter'
import PostTitle from './PostTitle'

export default function PostHeader ({ title, coverImage, date, author }) {
  return (
    <>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage
          title={title}
          src={coverImage}
          height={620}
          width={1240}
          coverImagePriority={true}
        />
      </div>
      <PostTitle>{title}</PostTitle>

      <div className="flex justify-between">
        <div className="md:block md:mb-12">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="flex align-middle justify-end text-xl md:text-2xl lg:text-md font-semibold tracking-tighter leading-tight ">
          <DateFormatter dateString={date} />
        </div>
      </div>
      
    </>
  )
}
