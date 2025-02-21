import { GitHubIcon, TwitterIcon, InstagramIcon } from "../Icons";
import SocialLinks from "../SocialLinks";

export default function Intro () {
  return (
    <section className="bg-[#111111] flex flex-col justify-center items-center md:flex-row md:justify-between mt-16 mb-16 md:mb-28 -mt-20 py-12 px-4 rounded">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-1/4 mt-8 md:mt-0 flex justify-center">
          <img src="https://ik.imagekit.io/wphcyip3g/racoelho_dev/darkbannerimage.png?updatedAt=1707339583738" alt="Rafael Coelho" className="rounded-full w-48 h-48 object-cover" />
        </div>
        <div className="w-full md:w-3/4">
          <h2 className="text-3xl font-bold">Opa, tudo certo?</h2>
          <p className="mt-4">            
            Aqui, tu vai encontrar Conteúdo sobre Programação e Desafios para tentar te incentivar a continuar aprendendo;
            <br />
            <br />
            Se quiser ver mais do que eu faço, olha nesses incones aqui em baixo 👇
          </p>

          <div className="flex mt-4 text-white">
            {
              SocialLinks.Links.map((item, index) => (
                <a key={index} target="_blank" href={item.href} className="mr-4" rel="noreferrer">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))
            }
          </div>
        </div>

      </div>
    </section>
  )
}
