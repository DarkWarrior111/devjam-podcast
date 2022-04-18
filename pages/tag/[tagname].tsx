import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { useQuery } from 'react-query'
import PodcastList from '../../Components/PodcastList'
import { PodcastIndexTrending } from '../../utils/types'

const Tagname = () => {
  const {
    query: { tagname },
  } = useRouter()

  const {
    isLoading,
    isError,
    data: podcasts,
    refetch,
  } = useQuery<PodcastIndexTrending>(
    ['tagpage', tagname],
    async () => {
      try {
        let { data } = await axios({
          baseURL: window.location.origin,
          url: '/api/tag/' + tagname,
        })

        return data
      } catch (error) {
        throw error
      }
    },
    {
      enabled: !!tagname,
      cacheTime: 1000 * 60 * 60,
      staleTime: 1000 * 60 * 60,
    }
  )

  return (
    <>
      <Head>
        <title>{tagname} | Podcasts</title>
      </Head>
      <PodcastList
        title={tagname as string}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
        podcasts={podcasts}
      />
    </>
  )
}

export default Tagname
