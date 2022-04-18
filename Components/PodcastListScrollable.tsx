import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import { useQuery } from 'react-query'
import { PodcastIndexTrending } from '../utils/types'
import ErrorMessage from './ErrorMessage'
import PodcastCard from './PodcastCard'
import { PodcastCardSkeleton } from './Skeletons'

const PodcastListScrollable = ({ title = '', url = '' }) => {
  const {
    isLoading,
    isError,
    data: podcasts,
    refetch,
  } = useQuery<PodcastIndexTrending>(
    [title],
    async () => {
      try {
        let { data }: { data: PodcastIndexTrending } = await axios({
          url: '/api' + url,
          params: { limit: 10 },
        })

        return data
      } catch (error) {
        throw error
      }
    },
    {
      enabled: !!title,
      cacheTime: 1000 * 60 * 60,
      staleTime: 1000 * 60 * 60,
    }
  )

  return (
    <div className="min-h-[225px] space-y-2 p-2 dark:text-white">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={url}>
          <a className="self-end text-sm text-gray-700 hover:underline dark:text-gray-200">
            See more...
          </a>
        </Link>
      </div>
      <div className="scroller grid h-full min-h-[200px] grid-flow-col gap-2 overflow-x-auto">
        {podcasts?.feeds.map((feed, i) => (
          <div className="w-32" key={'' + feed.id + i}>
            <PodcastCard data={feed} />
          </div>
        ))}

        {isLoading &&
          Array(10)
            .fill('')
            .map((_, i) => (
              <div className="w-32" key={i}>
                <PodcastCardSkeleton />
              </div>
            ))}

        {isError && (
          <div className="h-full w-full rounded bg-gray-200 dark:bg-gray-800">
            <ErrorMessage message="An error occured" retry={refetch} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PodcastListScrollable
