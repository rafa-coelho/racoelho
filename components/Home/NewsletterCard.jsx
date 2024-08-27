import axios from "axios";
import { useEffect, useState } from "react";
import { MailIcon } from '../Icons';

const NewsletterCard = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ error: '', success: '' });
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [subscribed, setSubscribed] = useState(undefined);

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
            setLoading(false);
        }        
    };

    const handleClose = () => {
        setIsVisible(false);

    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (message.success) {
                setIsVisible(false);
                setSubscribed(true);
            }
            setMessage({ error: '', success: '' });
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    useEffect(() => {
        if (subscribed !== undefined && subscribed !== null) {
            localStorage.setItem('subscribed', subscribed);
        }
    }, [subscribed]);

    useEffect(() => {
        const subscribed = localStorage.getItem('subscribed');
        setSubscribed((subscribed || "").toString() == 'true');
    }, []);


    if (!isVisible || subscribed === true || ([null, undefined].includes(subscribed)) || router.pathname === '/newsletter') {
        return "";
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 p-6 pt-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Participe da minha Newsletter</h2>
                <button
                    className="text-gray-500 hover:text-gray-300 focus:outline-none"
                    onClick={handleClose}
                >
                    &times;
                </button>
            </div>
            <p className="text-gray-400 mb-4">
                Se você não tem tempo de ler notícias de tecnologia, eu compilo pra você!
            </p>
            <span className="text-red-500 text-sm ml-2">{message.error}</span>
            <span className="text-green-500 text-sm ml-2">{message.success}</span>
            <form onSubmit={handleSubmit} className="flex items-center">
                <div className="relative flex-grow">
                    <input
                        type="email"
                        className="w-full px-4 py-2 pl-10 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <MailIcon
                        className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
                        width="20"
                        height="20"
                    />
                </div>
                <button
                    type="submit"
                    className={`ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={loading}
                >
                    {
                        loading ? 'Enviando...' : 'Increver'
                    }
                </button>
            </form>
        </div>
    );
};

export default NewsletterCard;
