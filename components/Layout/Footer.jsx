import Link from 'next/link'
import Container from './Container'
import Highlight from '../Utils/Highlight'
import { BLOG_NAME } from '../../lib/constants'
import { GitHubIcon, InstagramIcon, TwitterIcon } from '../Icons'

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Sobre mim', href: '/about' },
    { name: 'Blog', href: '/posts' },
  ],
  social: [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/rafael.coelho_',
      icon: InstagramIcon,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/racoelhodev',
      icon: TwitterIcon,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/rafa-coelho',
      icon: GitHubIcon,
    }
  ],
}

export default function Footer () {
  return (
    <footer className=" border-t border-accent-2 bg-black text-white border-black h-full pb-10">
      <Container>
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav
            className="-mx-5 -my-2 flex flex-wrap justify-center"
            aria-label="Footer"
          >
            {navigation.main.map((item, index) => (
              <div key={index} className="px-5 py-2">
                <Link
                  href={item.href}
                  target='_blank'
                  className="text-base text-gray-500 hover:text-gray-200">

                  {item.name}

                </Link>
              </div>
            ))}
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            {navigation.social.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target='_blank'
                className="text-gray-400 hover:text-gray-200" rel="noreferrer"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-center text-base text-gray-400 cursor-default">
            <Highlight>{BLOG_NAME}</Highlight> <br /> 2024{new Date().getFullYear() > 2024 ? `- ${new Date().getFullYear()}` : ''}
          </p>
        </div>
      </Container>
    </footer>
  );
}
