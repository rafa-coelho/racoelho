import Head from 'next/head'
import Container from '../components/Layout/Container'
import Layout from '../components/Layout/Layout'
import { BLOG_NAME } from '../lib/constants'
import PageHeading from '../components/PageHeading'

export default function About () {
  return (
    <Layout>
      <Head>
        <title>Sobre mim | {BLOG_NAME}</title>
      </Head>
      <Container>
        <PageHeading>Quem é o Rafael?</PageHeading>
        <section className="max-w-3xl mx-auto py-8 md:py-16 lg:py-24">
          <p>
            Meu nome é Rafael Coelho e sou apaixonado por tecnologia aos 12 anos.
            Gosto de desenvolver sistemas, criar automações, fazer protótipos no Figma, gravar vídeos e etc.
          </p>
          <br />
          <p>
            Eu trabalho com <b>.NET</b>, <b>Angular</b>, <b>React</b>, <b>NodeJS</b>, <b>Flutter</b> e etc. e tenho conhecimentos de DevOps também.
          </p>
          <br />
          <p>
            Como desenvolvedor, já trabalhei em sistemas grandes e criei várias aplicações do zero,
            tanto como freelancer como aplicações próprias.
          </p>
          <br />
          <p>
            Amo meu trabalho e nas horas vagas gosto de assistir séries, animes e jogar video games.
          </p>          
        </section>
      </Container>
    </Layout>
  )
}
