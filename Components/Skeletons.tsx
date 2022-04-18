import React from 'react'
import { FaPlusCircle } from 'react-icons/fa'

export const PodcastCardSkeleton = () => {
  return (
    <div className="h-full space-y-2 rounded border bg-gray-200 p-3 shadow transition-colors hover:bg-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-900">
      <div className="mx-auto aspect-square w-full animate-pulse bg-gray-300" />
      <div className="h-3 w-11/12 animate-pulse bg-gray-400" />
      <div className="h-3 w-5/12 animate-pulse bg-gray-400" />
      <div className="h-2 w-7/12 animate-pulse bg-gray-400" />
    </div>
  )
}

export const PodcastHeaderSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="flex animate-pulse gap-3">
        <div className="aspect-square h-32 w-32 bg-gray-200" />
        <div className="w-full space-y-3">
          <div className="h-7 w-11/12 bg-gray-300" />
          <div className="h-4 w-3/4 bg-gray-300" />

          <div className="flex flex-wrap gap-2">
            {Array(4)
              .fill('')
              .map((_, i) => (
                <div
                  key={'faketext' + i}
                  className="h-5 w-16 rounded-xl bg-gray-300"
                />
              ))}
          </div>
        </div>
      </div>
      <div className="mb-3 animate-pulse space-y-2">
        {Array(Math.ceil(Math.random() * 5))
          .fill('')
          .map((_, i) => (
            <div key={'faketags' + i} className="h-2 w-full bg-gray-300" />
          ))}
        <div className="h-2 w-7/12 bg-gray-300" />
      </div>
    </div>
  )
}

export const PodcastEpisodeSkeleton = () => {
  return (
    <div className="flex gap-2 rounded bg-gray-200 dark:bg-gray-800 p-3">
      <div className=" my-auto aspect-square h-16 w-16 animate-pulse bg-gray-300" />

      <div className="w-full space-y-2">
        <div className="h-4 w-full bg-gray-300" />

        <div className="h-2 w-full bg-gray-300" />
        <div className="h-2 w-7/12 bg-gray-300" />

        <div className="flex items-center gap-3 text-sm text-gray-300">
          <FaPlusCircle size={20} className=" pointer-events-none" />

          <div className="h-2 w-7/12 bg-gray-300" />
        </div>
      </div>
    </div>
  )
}
