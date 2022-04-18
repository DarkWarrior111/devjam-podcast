import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import PodcastCard from '../Components/PodcastCard'
import PodcastList from '../Components/PodcastList'
import { PodcastCardSkeleton } from '../Components/Skeletons'
import { PodcastIndexTrending } from '../utils/types'

const Search = () => {
  const {
    query: { q, type },
  } = useRouter()

  const {
    isLoading,
    isError,
    data: searchResults,
    refetch,
  } = useQuery<PodcastIndexTrending>(
    ['search', q, type],
    async () => {
      try {
        let { data } = await axios({
          baseURL: window.location.origin,
          url: '/api/search',
          params: {
            q,
            mode: type,
            lang: 'en',
          },
        })

        return data
      } catch (error) {
        throw error
      }
    },
    {
      enabled: !!q,
      cacheTime: 1000 * 60 * 60,
      staleTime: 1000 * 60 * 60,
    }
  )

  return (
    <>
    <Head>
      <title>
        {q} | Search
      </title>
    </Head>
      <PodcastList
        title={
          <h2 className="mx-3 text-xl font-bold">
            <span className="text-gray-700 dark:text-gray-200">
              Results for{' '}
            </span>
            "{q}":
          </h2>
        }
        podcasts={searchResults}
        isError={isError}
        isLoading={isLoading}
        refetch={refetch}
      />
    </>
  )
}

export default Search
