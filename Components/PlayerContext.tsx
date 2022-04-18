import { useEffect } from 'react'
import { createContext, ReactElement, useContext, useState } from 'react'
import { Episode } from '../utils/types'
import AudioPlayer from './Player'

interface PlayerContext {
  currentEpisode?: Episode
  queue: Episode[]
  addToQueue: (episodes: Episode[]) => void
  updateQueue: (episodes: Episode[]) => void
  playEpisode: (episode: Episode) => void
}

const PlayerContext = createContext({
  currentEpisode: undefined,
  queue: [],
  addToQueue: () => null,
  playEpisode: () => null,
  updateQueue: () => null,
} as PlayerContext)

export function usePlayer() {
  return useContext(PlayerContext)
}

const PodcastContext = ({ children }: { children: ReactElement[] }) => {
  const [previousEpisodes, setPreviousEpisodes] = useState<Episode[]>([])
  const [episodeQueue, setEpisodeQueue] = useState<Episode[]>([])
  const [currentEpisode, setCurrentEpisode] = useState<Episode>()

  useEffect(() => {
    let episodeQueue = localStorage.getItem('episodeQueue')
    let currentEpisode = localStorage.getItem('currentEpisode')

    if (episodeQueue) {
      setEpisodeQueue(JSON.parse(episodeQueue))
    }

    if (currentEpisode) {
      setCurrentEpisode(JSON.parse(currentEpisode))
    }
  }, [])

  useEffect(() => {
    if (previousEpisodes && previousEpisodes.length > 0)
      localStorage.setItem('previousEpisodes', JSON.stringify(previousEpisodes))

    if (episodeQueue && episodeQueue.length > 0)
      localStorage.setItem('episodeQueue', JSON.stringify(episodeQueue))

    if (currentEpisode)
      localStorage.setItem('currentEpisode', JSON.stringify(currentEpisode))
  }, [previous, episodeQueue, currentEpisode])

  function next() {
    if (currentEpisode && episodeQueue && episodeQueue.length > 0) {
      let newEpisodeQueue = [...episodeQueue]

      setPreviousEpisodes([...previousEpisodes, currentEpisode])
      setCurrentEpisode(newEpisodeQueue.shift())
      setEpisodeQueue(newEpisodeQueue)
    }
  }

  function previous() {
    if (currentEpisode && previousEpisodes && previousEpisodes.length > 0) {
      let newPreviousEpisodes = [...(previousEpisodes || [])]
      setPreviousEpisodes(
        previousEpisodes.slice(0, newPreviousEpisodes.length - 1)
      )
      setEpisodeQueue([currentEpisode, ...episodeQueue])
      setCurrentEpisode(newPreviousEpisodes.pop())
    }
  }

  function addToQueue(episodes: Episode[]) {
    let newEpisodes = [...episodes]
    if (currentEpisode) {
      setEpisodeQueue([...episodeQueue, ...newEpisodes])
    } else {
      setCurrentEpisode(newEpisodes.shift())
      setEpisodeQueue([...newEpisodes])
    }
  }

  function playEpisode(episode: Episode) {
    setCurrentEpisode(episode)
  }

  function updateQueue(episodes: Episode[]) {
    let newEpisodes = [...episodes]
    newEpisodes.length > 0 && setCurrentEpisode(newEpisodes.shift())
    setEpisodeQueue(newEpisodes)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        addToQueue,
        playEpisode,
        queue: episodeQueue,
        updateQueue,
      }}
    >
      <div className="min-h-screen dark:bg-black">
        {children}
        {currentEpisode && (
          <>
            {/* To prevent player from covering content at bottom of screen */}
            {/* position:sticky cannot be used because it puts player in middle of screen if the
           content's height is less than viewport height */}
            <div className="sticky bottom-0 h-[6.125rem]" />
            <div className="fixed bottom-0 z-10 h-[6.125rem] w-full bg-gray-300 drop-shadow-2xl dark:bg-gray-900">
              <AudioPlayer
                autoplay
                previous={previous}
                next={next}
                key={currentEpisode.id}
                episode={currentEpisode}
              />
            </div>
          </>
        )}
      </div>
    </PlayerContext.Provider>
  )
}

export default PodcastContext
