import Link from 'next/link';
import React from 'react';

const ProjectCard = ({ title, techStack, description, url, links }) => {
  return (
    <div className="bg-[#111111] text-white p-6 rounded-lg flex flex-col justify-between">
      <div>
        <h3 className="text-x font-bold">{title}</h3>
        <p className="text-gray-400">{techStack}</p>
      </div>
      <p className="mt-6 my-3">{description}</p>
      <div className="w-100 flex justify-between">
        {
          links.map((link, k) => (
            <div key={k} className="w-1/3 text-center text-sm">
              <Link
                as={link.url}
                href={link.url}
                className="text-indigo-200 hover:text-indigo-300"
                rel="noreferrer"
                target='_blank'
              >
                {link.title}
              </Link>
            </div>
          ))
        }

        {/* <Link
          as={url}
          href={url}
          className="text-[#ccc] hover:text-indigo-300"
          rel="noreferrer"
          target='_blank'
        >
          Ver mais
        </Link> */}
      </div>
    </div>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Amigo Secreto",
      description: "Gerenciador de amigo secreto sem banco de dados",
      url: "/posts/construi-um-jogo-de-jokenpo",
      links: [
        { title: "Artigo", url: "/posts/sorteio-de-amigo-secreto" },
        { title: "Repositório", url: "https://github.com/rafa-coelho/amigo-secreto" },
      ],
      techStack: "NextJS, JavaScript"
    },
    {
      title: "Jokenpô",
      description: "Jogo de Jokenpo multiplayer feito com WebSockets",
      url: "/posts/construi-um-jogo-de-jokenpo",
      links: [
        { title: "Artigo", url: "/posts/construi-um-jogo-de-jokenpo" },
        { title: "Repositório", url: "https://github.com/rafa-coelho/jokenpo" },
      ],
      techStack: "NodeJS, Javascript, WebSockets"
    },
    {
      title: "Fichas de RPG",
      description: "Sistema de gerenciamento de Fichas de RPG focado no Dungeons and Dragons",
      url: "https://github.com/rafa-coelho/SistemaFichas",
      links: [
        { title: "Repositório", url: "https://github.com/rafa-coelho/SistemaFichas" }
      ],
      techStack: "React JS"
    },
    {
      title: "Site de Casamento",
      description: "Sistema que eu usei para o meu site de casamento com lista de compras, pagamento online e confirmação de presença!",
      url: "https://github.com/rafa-coelho/site-casamento",
      links: [
        { title: "Repositório", url: "https://github.com/rafa-coelho/site-casamento" }
      ],
      techStack: "React JS"
    },
    {
      title: "Client da API do Pagseguro",
      description: "Pacote NPM para consumir a API de pagamento transparente do PagSeguro",
      url: "https://www.npmjs.com/package/pagseguro-api",
      links: [
        { title: "Repositório", url: "https://www.npmjs.com/package/pagseguro-api" }
      ],
      techStack: "NodeJS"
    },
  ];

  return (
    <section className="p-12 min-h-screen gap-8 flex flex-col">
      <h2 className="text-3xl text-white font-bold mb-8 text-center">Projetos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {
          projects.map((project, index) => (
            <ProjectCard key={index} title={project.title} techStack={project.techStack} description={project.description} url={project.url} links={project.links} />
          ))
        }
      </div>
      <div className="text-center mt-8">

        <Link
          as={"https://github.com/rafa-coelho"}
          href="https://github.com/rafa-coelho"
          target='_blank'
          className="text-white hover:text-gray-500"
          rel="noreferrer"
        >
          Ver Repositórios
        </Link>
      </div>
    </section>
  );
};

export default Projects;
