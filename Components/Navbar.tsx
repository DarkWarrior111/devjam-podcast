import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  FaInfoCircle,
  FaMoon,
  FaRandom,
  FaSearch,
  FaSun,
  FaTag,
  FaTags,
} from 'react-icons/fa'
import AboutModal from './AboutModal'

const Navbar = () => {
  const [aboutModalOpen, setaboutModalOpen] = useState(false)

  // show about modal on first site loaded
  // by checking if darkmode setting is present
  useEffect(() => {
    setaboutModalOpen(!localStorage.getItem('darkMode'))
  }, [])

  const [urlChanging, setUrlChanging] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  const [tagMode, setTagMode] = useState(false)

  function toggleDarkMode(mode?: 'dark' | 'light') {
    if (mode) {
      setDarkMode(mode === 'dark')
      localStorage.setItem('darkMode', String(mode === 'dark'))
      document.body.classList.toggle('dark', mode === 'dark')
    } else {
      setDarkMode(!darkMode)
      localStorage.setItem('darkMode', String(!darkMode))
      document.body.classList.toggle('dark', !darkMode)
    }
  }

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    const localStorageDarkMode = localStorage.getItem('darkMode')

    if (localStorageDarkMode === 'false') {
      toggleDarkMode('light')
    } else if (localStorageDarkMode === 'true' || prefersDark.matches) {
      toggleDarkMode('dark')
    } else {
      toggleDarkMode('light')
    }
  }, [])

  useEffect(() => {
    const handleStart = (url: string) => {
      setUrlChanging(true)
    }
    const handleStop = () => {
      setUrlChanging(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return (
    <>
      {/* Shows loading bar on top of screen when url is changing */}
      {urlChanging && (
        <div className="absolute top-0 left-0 right-0 z-50 h-[2px] overflow-hidden">
          <div className="animate-loading h-full w-full">
            <div className="h-full w-1/3 bg-red-500" />
          </div>
        </div>
      )}

      <nav className="z-20 flex h-10 items-center justify-between gap-5 bg-gray-300 px-2 pb-1 pt-1.5 shadow-md dark:bg-gray-900">
        <Link href="/">
          <a className="z-10 text-lg font-bold text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white">
            Home
          </a>
        </Link>

        <div className="flex h-8 items-center overflow-hidden rounded bg-gray-100 outline-1 outline-gray-600 focus-within:outline dark:bg-gray-800">
          <button
            onClick={(e) => {
              setTagMode(!tagMode)
            }}
            title={
              tagMode
                ? 'Search by tag. Use spaces to separate multiple tags and add - at beginning to exclude tags eg: tag1 -tag2'
                : 'Search podcasts by title or author'
            }
            className={`ml-2 grid place-content-center text-sm font-bold ${
              tagMode ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'
            }`}
          >
            <FaTags size={20} />
          </button>

          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault()
              router.push(
                `/search?q=${searchQuery}${tagMode ? '&type=tag' : ''}`
              )
            }}
          >
            <input
              type="search"
              placeholder={`${
                tagMode ? 'Search by tags...' : 'Search by title or author...'
              }`}
              className="ml-2 h-8 w-32 rounded-sm bg-transparent focus:outline-none dark:text-white sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button className="grid h-8 w-8 place-content-center text-gray-700 hover:bg-gray-600 hover:text-gray-100 dark:text-gray-300">
              <FaSearch className="pointer-events-none" />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/random">
            <a title="Random Podcast" className="dark:text-gray-200">
              <FaRandom size={20} />
            </a>
          </Link>
          <button
            onClick={() => toggleDarkMode()}
            className="grid h-8 w-8 place-content-center rounded text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white"
          >
            {darkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>

          <button
            onClick={() => setaboutModalOpen(!aboutModalOpen)}
            className="grid h-8 w-8 place-content-center rounded text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white"
          >
            <FaInfoCircle size={20} />
          </button>
        </div>
      </nav>

      <AboutModal open={aboutModalOpen} setOpen={setaboutModalOpen} />
    </>
  )
}

export default Navbar
