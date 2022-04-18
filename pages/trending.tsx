import axios from 'axios'
import Head from 'next/head'
import React from 'react'
import { useQuery } from 'react-query'
import PodcastCard from '../Components/PodcastCard'
import PodcastList from '../Components/PodcastList'
import { PodcastIndexTrending } from '../utils/types'

const Trending = () => {
  const {
    isLoading,
    isError,
    data: trending,
    refetch,
  } = useQuery<PodcastIndexTrending>(
    ['trendingpage'],
    async () => {
      try {
        let { data } = await axios({
          baseURL: window.location.origin,
          url: '/api/trending',
        })

        return data
      } catch (error) {
        throw error
      }
    },
    {
      cacheTime: 1000 * 60 * 60,
      staleTime: 1000 * 60 * 60,
    }
  )

  return (
    <>
      <Head>
        <title>Trending</title>
      </Head>
      <PodcastList
        title="Trending"
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        podcasts={trending}
      />
    </>
  )
}

export default Trending
