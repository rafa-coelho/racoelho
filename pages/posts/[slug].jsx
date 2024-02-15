import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import { BLOG_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import Container from '../../components/Layout/Container'
import Head from 'next/head'
import Header from '../../components/Post/Header'
import Layout from '../../components/Layout/Layout'
import PostBody from '../../components/Post/PostBody'
import PostHeader from '../../components/Post/PostHeader'
import PostTitle from '../../components/Post/PostTitle'
import FloatActionBar from '../../components/Post/FloatActionBar'

export default function Post ({ post, morePosts, preview }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage title='Postagem não encontrada' statusCode={404} />
  }

  const title = `${post.title} | ${BLOG_NAME}`;

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Carregando...</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{title}</title>
                <meta property="og:image" content={post.ogImage.url} />
                <meta property='keywords' content={post.keywords} />
                <meta property='description' content={post.excerpt} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
        
      </Container>
    </Layout>
  )
}

export async function getStaticProps ({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'keywords',
    'ogImage',
    'excerpt',
    'coverImage',
  ]);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths () {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
