import '../styles/global.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'
import 'prism-themes/themes/prism-dracula.css'
import Head from 'next/head';
import NewsletterCard from '../components/Home/NewsletterCard'
import { Toaster } from 'react-hot-toast';

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events]);

  useEffect(() => {
    setCanonicalUrl(window.location.origin + router.asPath);
  }, [router.asPath]);

  return <>
    <Head>
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Head>
    <Component {...pageProps} />
    <NewsletterCard />
    <Toaster />
  </>
}

export default App
