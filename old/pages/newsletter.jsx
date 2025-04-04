import Image from 'next/image';
import axios from "axios";
import { useEffect, useState } from "react";

import Head from 'next/head'
import Container from '../components/Layout/Container'
import Layout from '../components/Layout/Layout'
import { BLOG_NAME, DESCRIPTION, HOME_OG_IMAGE_URL, KEYWORDS } from '../lib/config/constants'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag';

export default function NewsLetterPage () {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ error: '', success: '' });
    let emailProvidedSent = false;

    const handleEmailChange = (e) => {
        setEmail(e.target.value);

        if (!emailProvidedSent) {
            gtag.event({
                action: 'email_input',
                category: 'newsletter',
                label: 'newsletter',
                value: 1,
            });
            emailProvidedSent = true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/email', { email });

            if (response.status === 200) {
                setEmail('');
                setMessage({ error: '', success: 'Email cadastrado com sucesso!' });
            }

        } catch (error) {
            setMessage({ error: 'Ocorreu um erro, tente novamente!', success: '' });
        }
        setLoading(false);
    };

    useEffect(() => {
        if (message.error == '' && message.success == '')
            return;

        const timer = setTimeout(() => {
            setMessage({ error: '', success: '' });
            if (message.success)
                router.push('/posts');
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);

    const title = `Newsletter | ${BLOG_NAME || "Loading..."}`
    return (
        <Layout hideNav>
            <Head>
                <title>{title}</title>
                <meta name="description" content={DESCRIPTION} />
                <meta name="keywords" content={KEYWORDS} />
                <meta property="og:image" content={HOME_OG_IMAGE_URL} />
            </Head>
            <Container>
                <div className="md:w-[60vw] container mx-auto py-6 px-4 w-full">
                    <div className="flex justify-center flex-col items-center">
                        <Image
                            src="https://github.com/rafa-coelho.png"
                            alt="Rafael Coelho"
                            className="rounded-full w-32 h-32 object-cover"
                            width={128}
                            height={128}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-around md:justify-between space-y-8 md:space-y-0 md:space-x-8 max-w-6xl my-8">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">Notícias de Tecnologia</h1>
                            <p className="mt-4 text-lg leading-8 text-gray-300">Se você não tem tempo de ler, eu compilo pra você!</p>
                            <p className='text-gray-500' >Se inscreva na minha newsletter e fique por dentro das notícias mais importantes do mundo de tecnologia</p>

                        </div>

                        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full md:w-1/3 flex-1">
                            <h2 className="text-xl font-bold mb-4 text-center md:text-left">Se inscreva na Newsletter</h2>
                            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-1 w-full">
                                <label htmlFor="email-address" className="sr-only">Seu melhor email</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email" required
                                    className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 flex-1"
                                    placeholder="Seu melhor email"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`mt-2 sm:mt-0 flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {
                                        loading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8v-4H4z"></path>
                                            </svg>
                                        ) : "Inscrever"
                                    }
                                </button>
                            </form>
                            <div className="w-full transition-all duration-500 ease-in-out ">
                                {message.error && <p className="text-red-500 mt-4">{message.error}</p>}
                                {message.success && <p className="text-green-500 mt-4">{message.success}</p>}
                            </div>
                        </div>
                    </div>


                </div>
            </Container>
        </Layout>
    )
}
