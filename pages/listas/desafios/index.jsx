import Head from 'next/head';
import Link from 'next/link';
import Container from '../../../components/Layout/Container';
import Layout from '../../../components/Layout/Layout';
import Empty from '../../../components/Layout/Empty';
import { BLOG_NAME, DESCRIPTION, HOME_OG_IMAGE_URL, KEYWORDS } from '../../../lib/constants';
import { getAllChallenges } from '../../../lib/api';
import Image from 'next/image'
import CoverImage from '../../../components/Image/CoverImage'

export default function ChallengesListPage ({ challenges }) {
    const title = `Desafios | ${BLOG_NAME || "Loading..."}`;

    return (
        <Layout hideNav>
            <Head>
                <title>{title}</title>
                <meta name="description" content={DESCRIPTION} />
                <meta name="keywords" content={KEYWORDS} />
                <meta property="og:image" content={HOME_OG_IMAGE_URL} />
            </Head>
            <Container padding="">
                <h1 className="text-3xl font-bold text-center p-8">Desafios</h1>
                {
                    challenges.length == 0
                        ? <Empty message="Ainda não há nada aqui..." />
                        : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
                                {
                                    challenges.map((challenge, index) => (
                                        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                            <Link href={`/listas/desafios/${challenge.slug}`} passHref>
                                                    <CoverImage
                                                        title={challenge.title}
                                                        src={challenge.coverImage}
                                                        height={278}
                                                        width={556}
                                                        fullWidth
                                                    />
                                                
                                                <div className="mt-4">
                                                    <h2 className="text-xl font-bold text-white">{challenge.title}</h2>
                                                    <p className="text-gray-400">{challenge.category}</p>
                                                    <p className="text-gray-300 mt-2">{challenge.description}</p>
                                                    <span className="text-indigo-500 hover:underline mt-4 block">Ver mais</span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                }
            </Container>
        </Layout>
    );
};

export async function getStaticProps () {
    const challenges = getAllChallenges([
        'title',
        'date',
        'slug',
        'categories',
        'coverImage',
        'content',
        'description'
    ]);

    return {
        props: { challenges },
    };
}
