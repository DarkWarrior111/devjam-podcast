import React, { ReactElement } from 'react'
import { PodcastIndexTrending } from '../utils/types'
import ErrorMessage from './ErrorMessage'
import PodcastCard from './PodcastCard'
import { PodcastCardSkeleton } from './Skeletons'

interface Props {
  title?: string | ReactElement
  podcasts?: PodcastIndexTrending
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

const PodcastList = ({
  title = '',
  podcasts,
  isLoading,
  isError,
  refetch,
}: Props) => {
  return (
    <div className="space-y-2 p-2 dark:text-white">
      {typeof title === 'string' ? (
        <h2 className="text-xl font-bold">{title}</h2>
      ) : (
        { ...title }
      )}
      <div className="grid w-full grid-cols-2 gap-2  sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {podcasts?.feeds?.map((feed, i) => (
          <PodcastCard data={feed} key={i} />
        ))}

        {isLoading &&
          Array(Math.floor(Math.random() * 4 + 7))
            .fill('')
            .map((_, i) => <PodcastCardSkeleton key={i} />)}
      </div>
      {isError && (
        <div className="h-full w-full">
          <ErrorMessage message="An error occured" retry={refetch} />
        </div>
      )}
    </div>
  )
}

export default PodcastList
