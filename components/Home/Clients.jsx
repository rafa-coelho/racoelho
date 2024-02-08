import React from 'react';

const ClientCard = ({ logo, title, subtitle, description, features }) => {
    return (
        <div className="bg-[#111111] text-white p-6 rounded-lg shadow-lg py-12">
            <div className="flex justify-center mb-4">
                <img src={logo} alt={title} className="h-20 aspect-square object-cover rounded-full" />
            </div>
            <h3 className="text-x text-xl font-bold mb-2">{title}</h3>
            <h4 className="text-sm text-gray-400 mb-4">{subtitle}</h4>
            <p className="mb-4 text-sm">{description}</p>
            <h5 className="text-lg font-bold mb-2">O que foi feito</h5>
            <ul className="list-disc list-inside text-sm">
                {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
        </div>
    );
};

const Clients = () => {

    const clients = [
        {
            "title": "Prefácio",
            "subtitle": "Portal de Controle de Vendas",
            "stack": "ReactJS e NodeJS",
            "description": "A Prefácio é uma empresa de confecção e venda de paramentos religiosos.",
            "features": ["Foi criado um sistema de gerenciamento de Pedidos e Clientes com gerenciamento de produção, estoque e com controle de acessos por níveis."],
            "logo": "https://ik.imagekit.io/wphcyip3g/racoelho_dev/prefacio.png?updatedAt=1701911037015"
        },
        {
            "title": "Club7",
            "subtitle": "Plataforma, Aplicativo e Aplicação BackOffice",
            "stack": "NextJS, NodeJS e Flutter",
            "description": "Club7 é uma plataforma onde estabelecimentos e motoristas de aplicativo se encontram.",
            "features": ["Sistema de mapeamento", "Portal para estabelecimentos", "Aplicativo para os motoristas", "Sistema de cobrança recorrente de assinatura do serviço", "Gerenciador de clientes."],
            "logo": "https://ik.imagekit.io/wphcyip3g/racoelho_dev/club7.png?updatedAt=1701911037908"
        },
        {
            "title": "LeadThis",
            "subtitle": "Plataforma de Geração e Venda de Leads",
            "stack": "NodeJS e ReactJS",
            "description": "O LeadThis era uma plataforma onde os corretores de planos de saúde podiam encontrar clientes em potencial.",
            "features": ["Sistema de captura de Leads", "Plataforma onde o Corretor podia comprar a Lead que mais lhe interessasse."],
            "logo": "https://ik.imagekit.io/wphcyip3g/racoelho_dev/leadthis.png?updatedAt=1701911037104"
        }
    ];

    return (
        <div className="bg-black py-12 px-8">
            <h2 className="text-3xl text-white font-bold mb-8 text-center">Clientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {clients.map((client, index) => (
                    <ClientCard
                        key={index}
                        logo={client.logo}
                        title={client.title}
                        subtitle={client.subtitle}
                        description={client.description}
                        features={client.features}
                    />
                ))}
            </div>
        </div>
    );
};

export default Clients;
