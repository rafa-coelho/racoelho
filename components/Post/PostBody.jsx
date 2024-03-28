// import AffiliateAd from '../AffiliateAd'
import AffiliateAd from 'affiliate-ad'
import markdownStyles from './markdown-styles.module.css'

export default function PostBody ({ content }) {
  return (
    <div className="max-w flex justify-start gap-4 flex-col md:flex-row">

      <div className="w-full md:w-3/4  p-2">
        <div
          className={markdownStyles['markdown']}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="w-full md:w-1/4">
        <AffiliateAd code={"AD-6A02F2A"}  />
      </div>
    </div>
  )
}
