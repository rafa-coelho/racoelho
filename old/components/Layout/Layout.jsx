import { useEffect, useState } from 'react'
import Footer from './Footer'
import Meta from './Meta'
import Nav from './Nav'

export default function Layout({ children, hideNav }) {
  const [darkMode, setDarkMode] = useState()

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setDarkMode(false)
    }
  }, [darkMode]);

  return (
    <>
      <Meta />
      <div className="min-h-screen text-gray-100 bg-black font-inter">
        {
          !hideNav && <Nav darkMode={darkMode} setDarkMode={setDarkMode} />
        }
        <main className={!hideNav ? "py-20" : "py-"}>{children}</main>
        <Footer />
      </div>
    </>
  );
}
