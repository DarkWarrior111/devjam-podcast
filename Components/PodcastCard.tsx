import Link from 'next/link'
import React from 'react'
import { Feed } from '../utils/types'

const PodcastCard = ({ data }: { data: Feed }) => {
  return (
    <Link href={`/podcast/${data.id}`}>
      <a>
        <div className="h-full w-full space-y-1 rounded border bg-gray-200 p-3 shadow transition-colors hover:bg-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-900">
          <img
            src={data.image}
            alt={data.title}
            className="mx-auto aspect-square w-full dark:text-white"
          />

          <h1
            className={`text-sm font-bold line-clamp-2 dark:text-white`}
            title={data.title}
          >
            {data.title}
          </h1>
          <p
            className="text-xs text-gray-700 line-clamp-2 dark:text-gray-200"
            title={data.author}
          >
            {data.author}
          </p>
        </div>
      </a>
    </Link>
  )
}

export default PodcastCard
