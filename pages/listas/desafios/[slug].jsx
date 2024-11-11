import ErrorPage from 'next/error'
import { useRouter } from 'next/router';
import Head from 'next/head';
import Container from '../../../components/Layout/Container';
import Layout from '../../../components/Layout/Layout';
import PostTitle from '../../../components/Post/PostTitle'
import { BLOG_NAME } from '../../../lib/constants';
import { getAllChallenges, getChallengeBySlug } from '../../../lib/api';
import markdownToHtml from '../../../lib/markdownToHtml'
import PostBody from '../../../components/Post/PostBody'
import CoverImage from '../../../components/Image/CoverImage'

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
                                    <meta name="keywords" content={challenge.categories} />
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

                                    <PostBody fullSized content={challenge.content} />
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
