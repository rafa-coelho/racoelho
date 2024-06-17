import axios from "axios";
import { useEffect, useState } from "react";

const NewsletterForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ error: '', success: '' });


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
        const timer = setTimeout(() => {
            setMessage({ error: '', success: '' });
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);


    return (
        <div className="relative isolate overflow-hidden bg-[#111111] py-10 rounded">
            <div className="flex justify-center">
                <div className="max-w-xl lg:max-w-lg text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Notícias de Tecnologia</h2>
                    <p className="mt-4 text-lg leading-8 text-gray-300">Se você não tem tempo de ler, eu compilo pra você!</p>
                    <p className='text-gray-500' >Se inscreva na minha newsletter e fique por dentro das notícias mais importantes do mundo de tecnologia</p>

                    <form onSubmit={handleSubmit} className="mt-6 flex gap-1 w-full">
                        <label htmlFor="email-address" className="sr-only">Seu melhor email</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email" required
                            className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 flex-1"
                            placeholder="Seu melhor email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
    );
};

export default NewsletterForm;  
