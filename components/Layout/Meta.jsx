import Head from 'next/head'
import { TWITTER_USERNAME } from '../../lib/config/constants'

// Favicon should be recreated at various sizes for each link below.
export default function Meta() {
  // const [theme, setTheme] = useState('okaidia');
  const theme = 'okaidia'

  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/favicon.ico"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon.ico"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon.ico"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="mask-icon" href="/favicon/favicon.ico" color="#000000" />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <meta name="twitter:site" content={TWITTER_USERNAME} />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
    </Head>
  )
}
