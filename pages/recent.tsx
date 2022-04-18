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
    data: recent,
    refetch,
  } = useQuery<PodcastIndexTrending>(
    ['recentpage'],
    async () => {
      try {
        let { data } = await axios({
          baseURL: window.location.origin,
          url: '/api/recent',
        })

        return data
      } catch (error) {
        throw error
      }
    },
    {
      refetchInterval: 1000 * 60 * 60,
      staleTime: 1000 * 60 * 60,
    }
  )

  return (
    <>
      <Head>
        <title>Recent</title>
      </Head>
      <PodcastList
        title="Recent"
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        podcasts={recent}
      />
    </>
  )
}

export default Trending
