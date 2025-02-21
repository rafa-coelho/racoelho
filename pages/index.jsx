import Link from 'next/link';
import Container from '../components/Layout/Container'
import Intro from '../components/Home/Intro'
import About from '../components/Home/About'
import NewsletterForm from '../components/Home/NewsletterForm'
import Layout from '../components/Layout/Layout'
import Head from 'next/head'
import { getAllPosts, getAllChallenges } from '../lib/api'
import { BLOG_NAME, DESCRIPTION, HOME_OG_IMAGE_URL, KEYWORDS } from '../lib/constants'
import PostPreview from '../components/Home/PostPreview'

export default function Index ({ recentPosts, recentChallenges }) {
  const title = `Home | ${BLOG_NAME || "Loading..."}`
  return (
    <>
      <Layout>
        <Head>
          <title>{title}</title>
          <meta name="description" content={DESCRIPTION} />
          <meta name="keywords" content={KEYWORDS} />
          <meta property="og:image" content={HOME_OG_IMAGE_URL} />
        </Head>
        <Container>
          <Intro />
          <About />

          <ChallengesSection recentChallenges={recentChallenges} />
          
          <PostsSection recentPosts={recentPosts} />

          {/* <NewsletterForm /> */}

        </Container>
      </Layout>
    </>
  )
};

const ChallengesSection = ({ recentChallenges }) => {
  return (
    <section className="flex flex-col justify-center items-center md:flex-row md:justify-between mt-16 mb-16 md:mb-28 -mt-20">
      <div className=" rounded py-12 px-8">
        <h2 className="text-3xl text-white font-bold mb-8 text-center">Últimos desafios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {
            recentChallenges.map((post) => (
              <PostPreview
                key={post.slug}
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                slug={post.slug}
              />
            ))
          }
        </div>
        <div className="text-center mt-8">

          <Link
            as={"/listas/desafios"}
            href="/listas/desafios"
            className="text-white hover:text-gray-500"
            rel="noreferrer"
          >
            Ver outros Desafios
          </Link>
        </div>
      </div>
    </section>
  )
};

const PostsSection = ({ recentPosts }) => {
  return (
    <section className="flex flex-col justify-center items-center md:flex-row md:justify-between mt-16 mb-16 md:mb-28 -mt-20">
      <div className="bg-[#111111] rounded py-12 px-8">
        <h2 className="text-3xl text-white font-bold mb-8 text-center">Posts recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {
            recentPosts.map((post) => (
              <PostPreview
                key={post.slug}
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                slug={post.slug}
              />
            ))
          }
        </div>
        <div className="text-center mt-8">

          <Link
            as={"/posts"}
            href="/posts"
            className="text-white hover:text-gray-500"
            rel="noreferrer"
          >
            Ver outros Posts
          </Link>
        </div>
      </div>
    </section>
  )
};

export async function getStaticProps () {
  const recentPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ]).slice(0, 3);

  const recentChallenges = getAllChallenges([
    'title',
    'date',
    'level',
    'slug',
    'categories',
    'coverImage',
    'content',
    'description'
  ]).slice(0, 3);

  return {
    props: { recentPosts, recentChallenges },
  }
}

