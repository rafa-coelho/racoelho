import { GitHubIcon, TwitterIcon, InstagramIcon } from "../Icons";

export default function Intro () {
  return (
    <section className="bg-[#111111] flex flex-col justify-center items-center md:flex-row md:justify-between mt-16 mb-16 md:mb-28 -mt-20 py-12 px-4 rounded">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/4 mt-8 md:mt-0 flex justify-center">
          <img src="https://github.com/rafa-coelho.png" alt="Rafael Coelho" className="rounded-full w-48 h-48 object-cover" />
        </div>
        <div className="w-full md:w-3/4">
          <h2 className="text-3xl font-bold">Quem sou eu?</h2>
          <p className="mt-4">
            Meu nome é Rafael Coelho e sou Desenvolvedor de Sistemas.
            <br />
            Amo o que eu faço e passo bastante tempo treinando e estudando para me tornar cada vez melhor.
            Seja Frontend, Backend, DevOps, Mobile ou mesmo design com Figma ou edição de video... eu gosto de tudo um pouco.
            <br />
            Por isso criei esse site com blog para poder escrever sobre o que o que eu amo: Programação e tecnologia.
            <br />
          </p>

          <h3 className="text-lg font-bold mt-5">Redes Sociais</h3>

          <div className="flex mt-4 text-white">
            <a target="_blank" href="https://github.com/rafa-coelho" className="mr-4" rel="noreferrer">
              <GitHubIcon className="h-6 w-6" />
            </a>
            <a target="_blank" href="https://www.instagram.com/racoelhoo" className="mr-4" rel="noreferrer">
              <InstagramIcon className="h-6 w-6" />
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
