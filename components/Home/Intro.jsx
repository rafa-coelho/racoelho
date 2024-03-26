import Image from "next/image";

export default function Intro () {
  return (
    <section className="flex flex-col justify-center items-center md:flex-row md:justify-between mt-16 mb-16 md:mb-28 -mt-20">
      <span className="text-3xl font-light">
        <small>
          Oi, eu sou <br />
        </small>
        <h1 className="text-6xl md:text-8xl lg:text-7xl font-bold tracking-tighter leading-tight md:pr-8">
          Rafael Coelho
        </h1>
        Software Developer
      </span>
      <div className="h-1/2 w-auto aspect-square">
        <Image
          src="https://ik.imagekit.io/wphcyip3g/racoelho_dev/darkbannerimage.png?updatedAt=1707339583738"
          alt="Site Banner"
          width={1024} height={1024}
          className=" w-96 h-auto aspect-square"
        />
      </div>
    </section>
  )
}
