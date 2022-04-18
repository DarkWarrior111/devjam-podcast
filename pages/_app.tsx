import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../Components/Navbar'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useState } from 'react'
import PodcastContext from '../Components/PlayerContext'

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <PodcastContext>
          <Navbar />
          <Component {...pageProps} />
        </PodcastContext>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
