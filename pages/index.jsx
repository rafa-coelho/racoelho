import Container from '../components/Layout/Container'
import Intro from '../components/Home/Intro'
import Knowledge from '../components/Home/Knowledge'
import Projects from '../components/Home/Projects'
import Clients from '../components/Home/Clients'
import Layout from '../components/Layout/Layout'
import Head from 'next/head'
import { BLOG_NAME } from '../lib/constants'
import { KEYWORDS, DESCRIPTION } from '../lib/constants'

export default function Index () {
  const title = `Home | ${BLOG_NAME || "Loading..."}`
  return (
    <>
      <Layout>
        <Head>
          <title>{title}</title>
          <meta name="description" content={"Um pouquinho mais sobre mim - Rafael Coelho"} />
          <meta name="keywords" content={KEYWORDS} />
        </Head>
        <Container>
          <Intro />
          <Knowledge />
          <Projects />
          <Clients />
        </Container>
      </Layout>
    </>
  )
}

