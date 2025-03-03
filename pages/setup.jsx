import Image from 'next/image';
import Head from 'next/head';
import Container from '../components/Layout/Container';
import Layout from '../components/Layout/Layout';
import { BLOG_NAME, DESCRIPTION, HOME_OG_IMAGE_URL, KEYWORDS } from '../lib/constants';
import SocialLinks from "../components/SocialLinks";
import { getSetupLinks } from "../lib/api";
import LinkTree from '../components/LinkTree/LinkTree';

export default function SetupPage (props) {
    const { links } = props;

    const title = `Meu Setup | ${BLOG_NAME || "Loading..."}`

    return (
        <Layout hideNav>
            <Head>
                <title>{title}</title>
                <meta name="description" content={DESCRIPTION} />
                <meta name="keywords" content={KEYWORDS} />
                <meta property="og:image" content={HOME_OG_IMAGE_URL} />
            </Head>
            <Container padding="">
                <div className="md:w-[60vw] container mx-auto py-6 px-4 w-full">
                    <div className="flex justify-center flex-col items-center">
                        <Image 
                            src="https://github.com/rafa-coelho.png"
                            alt="Rafael Coelho"
                            className="rounded-full w-32 h-32 object-cover" 
                            width={128}
                            height={128}
                        />
                        <h1 className="mt-2 text-3xl text-center">
                            Rafael Coelho
                        </h1>
                        <SocialLinks />
                    </div>

                    <div className="w-full mt-8">
                        <h2 className="text-xl text-white mb-4">Meu Setup?</h2>

                        <LinkTree>
                            {
                                links.general.map((category, index) => (
                                    <LinkTree.LinkTreeItem key={index} link={category} />
                                ))
                            }
                        </LinkTree>
                    </div>
                </div>
            </Container>

        </Layout>
    )
};


export async function getStaticProps ({ params }) {
    const links = getSetupLinks();

    return {
        props: {
            links,
        },
    };
};
