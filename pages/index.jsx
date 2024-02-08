import Container from '../components/Layout/Container'
import Intro from '../components/Home/Intro'
import Knowledge from '../components/Home/Knowledge'
import Projects from '../components/Home/Projects'
import Clients from '../components/Home/Clients'
import Layout from '../components/Layout/Layout'
import Head from 'next/head'
import { BLOG_NAME } from '../lib/constants'

export default function Index () {

  return (
    <>
      <Layout>
        <Head>
          <title>Home | {BLOG_NAME}</title>
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

