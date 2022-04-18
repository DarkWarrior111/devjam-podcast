import axios from 'axios'
import { url } from 'inspector'
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { title } from 'process'
import { useState, useEffect } from 'react'
import { isError } from 'react-query'
import ErrorMessage from '../Components/ErrorMessage'
import IntersectionObs from '../Components/IntersectionObs'
import PodcastCard from '../Components/PodcastCard'
import PodcastHeader from '../Components/PodcastHeader'
import PodcastListScrollable from '../Components/PodcastListScrollable'
import { PodcastCardSkeleton } from '../Components/Skeletons'
import apiHeaders from '../utils/apiHeaders'
import { Feed, Podcast } from '../utils/types'

const Home = ({ random }: { random: Podcast }) => {
  const [favourites, setFavourites] = useState<Feed[]>([])

  useEffect(() => {
    const favourites = localStorage.getItem('favourites')
    const parsedFavourites: Feed[] = favourites ? JSON.parse(favourites) : []

    setFavourites(parsedFavourites)
  }, [])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      {random && (
        <div className="space-y-3 bg-gray-300 p-5 text-gray-800 shadow dark:bg-gray-900 dark:text-gray-100">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Random:
          </h1>
          <PodcastHeader
            key={random.feed.id}
            podcast={random}
            showDescription={false}
          />
        </div>
      )}

      {favourites?.length > 0 && (
        <div className="min-h-[225px] space-y-2 p-2 dark:text-white">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">Favourites</h2>
            <Link href={'/favourites'}>
              <a className="self-end text-sm text-gray-700 hover:underline dark:text-gray-200">
                See more...
              </a>
            </Link>
          </div>
          <div className="scroller grid h-full min-h-[200px] grid-flow-col gap-2 overflow-x-auto">
            {favourites?.map((favourite, i) => (
              <div className="w-32" key={'' + favourite.id + i}>
                <PodcastCard data={favourite} />
              </div>
            ))}
          </div>
        </div>
      )}

      <IntersectionObs height={200} removeOnIntersect>
        <PodcastListScrollable title="Trending" url="/trending" />

        <PodcastListScrollable title="Recent" url="/recent" />

        <PodcastListScrollable title="Technology" url="/tag/Technology" />

        <PodcastListScrollable title="Comedy" url="/tag/Comedy" />

        <PodcastListScrollable title="Education" url="/tag/Education" />

        <PodcastListScrollable title="Learning" url="/tag/Learning" />
      </IntersectionObs>
    </>
  )
}

export default Home

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let random

  // TODO: show recommendations instead of random podcasts
  // using cat and notcat
  try {
    let { data } = await axios({
      method: 'GET',
      url: `https://api.podcastindex.org/api/1.0/episodes/random`,
      params: {
        max: 1,
        fulltext: '',
        pretty: '',
        lang: 'en',
      },
      headers: apiHeaders(),
    })

    if (data?.episodes?.[0]?.feedId) {
      let { data: podcast } = await axios({
        method: 'GET',
        url: `https://api.podcastindex.org/api/1.0/podcasts/byfeedid?id=${data.episodes[0].feedId}&pretty`,
        headers: apiHeaders(),
      })
      random = podcast
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        random: null,
      },
    }
  }

  return {
    props: {
      random,
    },
  }
}
