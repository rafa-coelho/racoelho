import Adsense from '../AdBanner'
import markdownStyles from './markdown-styles.module.css'

export default function PostBody ({ content }) {
  return (
    <div className="max-w flex justify-start gap-4">

      <div className="w-full md:w-3/4 mx-10 p-2">
        <div
          className={markdownStyles['markdown']}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="w-full md:w-1/4 h-20">
      </div>
    </div>
  )
}
