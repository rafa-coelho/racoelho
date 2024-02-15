import Container from '../../components/Layout/Container'
import Layout from '../../components/Layout/Layout'
import Head from 'next/head'
import { getAllPosts } from '../../lib/api'
import { BLOG_NAME } from '../../lib/constants'
import PostPreview from '../../components/Home/PostPreview'
import { KEYWORDS } from '../../lib/constants'

const Posts = ({ allPosts }) => {
    const posts = allPosts;

    const title = `Blog | ${BLOG_NAME || "Loading..."}`
    
    return (
        <Layout>
            <Head>
                <title>{title}</title>
                <meta name="description" content={"Blog sobre Programação e Tecnologia - Rafael Coelho"} />
                <meta name="keywords" content={KEYWORDS} />
                <meta property="og:image" content={HOME_OG_IMAGE_URL} />
            </Head>
            <Container>
                <section>
                    <h2 className="mb-8 text-6xl md:text-7xl lg:text-6xl font-bold tracking-tighter leading-tight mt-8">
                        Posts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32 px-12 py-4">
                        {
                            posts.length == 0 
                            && (
                                <small className='text-gray'>Ainda não há nada aqui...</small>
                            )
                        }
                        {posts.map((post) => (
                            <PostPreview
                                key={post.slug}
                                title={post.title}
                                coverImage={post.coverImage}
                                date={post.date}
                                author={post.author}
                                slug={post.slug}
                                excerpt={post.excerpt}
                            />
                        ))}
                    </div>
                </section>
            </Container>
        </Layout>
    );
};

export async function getStaticProps () {
    const allPosts = getAllPosts([
        'title',
        'date',
        'slug',
        'author',
        'coverImage',
        'excerpt',
    ])

    return {
        props: { allPosts },
    }
}


export default Posts;
