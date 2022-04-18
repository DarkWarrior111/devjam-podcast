import Link from 'next/link'
import React, { useState } from 'react'
import { FaPlay, FaPlusCircle } from 'react-icons/fa'
import { Episode } from '../utils/types'
import IntersectionObs from './IntersectionObs'
import { usePlayer } from './PlayerContext'

const PodcastEpisode = ({ episode }: { episode: Episode }) => {
  const [fullDescriptionShown, setFullDescriptionShown] = useState(false)

  const { playEpisode, addToQueue, currentEpisode } = usePlayer()

  return (
    <div className="flex gap-2 rounded bg-gray-200 p-3 drop-shadow-md transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-900">
      <button
        className="group relative min-w-fit"
        onClick={() => playEpisode(episode)}
      >
        <FaPlay
          size={24}
          className={`absolute top-1/2 left-1/2 z-10 ${
            currentEpisode !== episode ? 'hidden' : ''
          } -translate-x-1/2 -translate-y-1/2  drop-shadow group-focus-within:block group-hover:block`}
        />
        <IntersectionObs height={64} width={64} removeOnIntersect>
          <img
            placeholder={episode.title}
            src={episode.image || episode.feedImage}
            className="my-auto h-16 w-16 group-hover:brightness-75"
          />
        </IntersectionObs>
      </button>
      <div className="space-y-1 break-all">
        <Link href={episode.link}>
          <a className="font-bold outline-none hover:underline focus:underline">
            {/* ep 0 returns false when using episode.episode && ... */}
            {Number.isFinite(episode.episode) && (
              <span className="text-gray-700 dark:text-gray-200">
                {episode.episode}.{' '}
              </span>
            )}
            {episode.title}
          </a>
        </Link>

        <p
          onClick={(e) => {
            e.stopPropagation()
            setFullDescriptionShown(!fullDescriptionShown)
          }}
          className={`cursor-pointer text-gray-900 dark:text-gray-100`}
          dangerouslySetInnerHTML={{
            __html:
              fullDescriptionShown && episode.description.length > 100
                ? episode.description
                : episode.description.slice(0, 100),
          }}
        />

        <p className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
          {currentEpisode !== episode && (
            <button
              onClick={(e) => {
                addToQueue([episode])
              }}
              title="Add to queue"
            >
              <FaPlusCircle size={20} className="pointer-events-none" />
            </button>
          )}
          <span>
            <span>{episode.datePublishedPretty}</span>
            <span>{' · ' + toHMS(episode.duration)}</span>
          </span>
        </p>
      </div>
    </div>
  )
}

export default PodcastEpisode

function toHMS(duration: number) {
  let time = ''
  let hrs = Math.floor(duration / 3600)
  let mins = Math.floor((duration - hrs * 3600) / 60)

  if (hrs >= 1) {
    time += `${hrs} ${hrs > 1 ? 'hrs' : 'hr'} `
  }
  if (mins >= 1) {
    time += `${mins} ${mins > 1 ? 'mins' : 'min'} `
  }

  return time
}
