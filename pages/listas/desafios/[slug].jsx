import ErrorPage from 'next/error'
import { useRouter } from 'next/router';
import Head from 'next/head';
import Container from '../../../components/Layout/Container';
import Layout from '../../../components/Layout/Layout';
import PostTitle from '../../../components/Post/PostTitle'
import { BLOG_NAME } from '../../../lib/config/constants';
import { getAllChallenges, getChallengeBySlug } from '../../../lib/local-api';
import markdownToHtml from '../../../lib/markdownToHtml'
import PostBody from '../../../components/Post/PostBody'
import CoverImage from '../../../components/Image/CoverImage'
import CategoryBadge from '../../../components/CategoryBadge'

export default function ChallengeDetailsPage ({ challenge }) {
    const router = useRouter()
    if (!challenge || (!router.isFallback && !challenge?.slug)) {
        return <ErrorPage title='Desafio não encontrada' statusCode={404} />;
    }

    const title = `${challenge.title} | ${BLOG_NAME || "Loading..."}`;

    return (
        <Layout hideNav>
            <Container padding="">
                {
                    router.isFallback
                        ? (
                            <PostTitle>Carregando...</PostTitle>
                        ) : (
                            <>
                                <Head>
                                    <title>{title}</title>
                                    <meta name="description" content={challenge.description} />
                                    <meta name="keywords" content={challenge.keywords} />
                                    <meta property="og:image" content={challenge.ogImage.url} />
                                </Head>

                                <div className="p-4">
                                    <CoverImage
                                        title={challenge.title}
                                        src={challenge.coverImage}
                                        height={620}
                                        width={1240}
                                        coverImagePriority={true}
                                    />

                                    <div className="my-4">
                                        {
                                            challenge.categories.split(',').map((category, index) => (
                                                <CategoryBadge key={index} category={category} />
                                            ))
                                        }
                                    </div>

                                    <PostBody fullSized content={challenge.content} />
                                </div>

                                {/* block to get in touch to send the links */}
                                <div className="p-4">
                                    <h2 className="text-2xl font-bold">Envie o link do seu projeto</h2>
                                    <p className="text-lg">
                                        Envie o link do seu projeto para o email
                                        <a href="mailto:contato@racoelho.com.br" className="text-blue-500">
                                            {' '}
                                            contato@racoelho.com.br
                                        </a>.
                                    </p>
                                </div>

                            </>
                        )
                }
            </Container>
        </Layout>
    );
};


export async function getStaticProps ({ params }) {
    const challenge = getChallengeBySlug(params.slug, [
        'title',
        'date',
        'slug',
        'categories',
        'keywords',
        'coverImage',
        'ogImage',
        'content',
        'description'
    ]);

    if (challenge == null) {
        return {
            props: {
                project: null,
            }
        };
    }

    const content = await markdownToHtml(challenge.content || '');

    return {
        props: {
            challenge: {
                ...challenge,
                content,
            },
        },
    };
}

export async function getStaticPaths () {
    const projects = getAllChallenges(['slug'])

    return {
        paths: projects.map((challenge) => {
            return {
                params: {
                    slug: challenge.slug,
                },
            }
        }),
        fallback: false,
    }
}
