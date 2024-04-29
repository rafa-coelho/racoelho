import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as gtag from '../../lib/gtag'

const navigation = [
  {
    name: "Home",
    href: "/"
  },
  {
    name: 'Sobre mim',
    href: '/about',
  },
  {
    name: "Blog",
    href: '/posts',
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav({ darkMode, setDarkMode }) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <Disclosure
      as="nav"
      className="shadow bg-black text-white fixed top-0 z-30"
    >
      {({ open }) => (
        <>
          <div className="w-screen mx-auto px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="flex justify-between h-20 bg-black text-white">
              <div className="flex">
                
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item, index) => (
                    (<Link
                      key={index}
                      href={item.href}
                      onClick={(e) => {
                        gtag.event({
                          action: 'navbar_click',
                          category: 'Navigation',
                          label: `From: ${currentPath} To: ${item.href}`,
                          value: 1,
                        })
                      }}
                      className={
                        currentPath === item.href
                          ? 'border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-gray-200 text-gray-200'
                          : 'border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-300 hover:border-gray-200 hover:text-gray-200'
                      }>

                      {item.name}

                    </Link>)
                  ))}
                </div>
              </div>
              
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className=" inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden pb-5">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item, index) => (
                (<Link
                  key={index}
                  href={item.href}
                  className={
                    currentPath === item.href
                      ? 'border-transparent text-gray-500 hover:text-gray-600 hover:bg-gray-50 border-gray-500 text-gray-100 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                      : 'border-transparent text-gray-300 hover:text-gray-600 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                  }>

                  {item.name}

                </Link>)
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
