import { Popover } from '@headlessui/react'
import Head from 'next/head'
import React from 'react'
import { RefObject, useEffect, useRef, useState } from 'react'
import {
  FaBackward,
  FaBars,
  FaForward,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaTrash,
  FaVolumeDown,
  FaVolumeMute,
  FaVolumeOff,
  FaVolumeUp,
} from 'react-icons/fa'
import { Episode } from '../utils/types'
import { usePlayer } from './PlayerContext'

interface AudioPlayerProps {
  next: () => void
  previous: () => void
  episode: Episode
  autoplay?: boolean
}

const AudioPlayer = ({
  next,
  previous,
  episode,
  autoplay,
}: AudioPlayerProps) => {
  const audioPlayerRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (
        (e.target as HTMLElement).nodeName !== 'INPUT' &&
        audioPlayerRef.current &&
        !e.altKey &&
        !e.shiftKey
      ) {
        switch (e.code) {
          case 'Space':
            audioPlayerRef.current.paused
              ? audioPlayerRef.current.play()
              : audioPlayerRef.current.pause()
            e.preventDefault()
            break
          case 'ArrowLeft':
            if (e.ctrlKey) {
              if (audioPlayerRef.current.currentTime < 5) {
                audioPlayerRef.current.currentTime = 0
              } else {
                audioPlayerRef.current.currentTime -= 5
              }
              e.preventDefault()
            }
            break
          case 'ArrowRight':
            if (e.ctrlKey) {
              if (
                audioPlayerRef.current.duration -
                  audioPlayerRef.current.currentTime <
                5
              ) {
                audioPlayerRef.current.currentTime =
                  audioPlayerRef.current.duration
              } else {
                audioPlayerRef.current.currentTime += 5
              }
              e.preventDefault()
            }
            break
          case 'ArrowUp':
            if (e.ctrlKey) {
              if (audioPlayerRef.current.volume < 0.9) {
                audioPlayerRef.current.volume += 0.1
              } else {
                audioPlayerRef.current.volume = 1
              }
              e.preventDefault()
            }
            break
          case 'ArrowDown':
            if (e.ctrlKey) {
              if (audioPlayerRef.current.volume > 0.1) {
                audioPlayerRef.current.volume -= 0.1
              } else {
                audioPlayerRef.current.volume = 0
              }
              e.preventDefault()
            }
            break
          case 'KeyM':
            audioPlayerRef.current.muted = !audioPlayerRef.current.muted
            break
          case 'KeyN':
            next()
            break
          case 'KeyP':
            previous()
            break
        }
      }
    }

    addEventListener('keydown', handleKeyPress)

    return () => {
      removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const { playEpisode, updateQueue, queue } = usePlayer()

  return (
    <div className="flex h-full w-full items-center gap-3 p-2 text-gray-800 dark:text-gray-300">
      <Head>
        <title>Playing - {episode.title}</title>
      </Head>

      <div className="hidden items-center gap-1 sm:flex">
        <img src={episode.image || episode.feedImage} className="h-12 w-12" />

        <p
          title={episode.title}
          className="max-w-[12rem] text-sm font-bold text-gray-900 line-clamp-3 dark:text-gray-100"
        >
          {episode.title}
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-2">
        <PlaybackControl
          audioRef={audioPlayerRef}
          next={next}
          previous={previous}
        />
        <AudioElement
          // ref is used to set ref and audioRef is used to perform actions
          ref={audioPlayerRef}
          audioRef={audioPlayerRef}
          autoplay={autoplay}
          duration={episode.duration}
          type={episode.enclosureType}
          src={episode.enclosureUrl}
          id={episode.id}
        />
      </div>

      <div className="flex items-center gap-2 sm:w-48">
        {queue && queue.length > 0 && (
          <Popover as="div" className="relative flex items-center">
            <Popover.Button
              title="Queue"
              className="hover:text-black dark:hover:text-white"
            >
              <FaBars size={20} className="pointer-events-none" />
            </Popover.Button>
            <Popover.Panel className="absolute bottom-10 right-0 z-10 max-h-[50vh] w-64 max-w-5xl overflow-y-auto overflow-x-hidden overscroll-contain rounded bg-gray-300 p-1 text-black shadow drop-shadow dark:bg-gray-900 dark:text-white">
              {queue.map((episode, i) => (
                <div
                  title={episode.title}
                  className="group flex w-full rounded-sm p-1 hover:justify-between hover:bg-gray-200 dark:hover:bg-gray-800"
                  key={'' + i + episode.id}
                >
                  <button
                    onClick={() => {
                      playEpisode(episode)
                      updateQueue(queue.slice(i + 1, queue.length))
                    }}
                    className="text-left"
                  >
                    <span className="line-clamp-1">{episode.title}</span>
                  </button>
                  <button
                    title="Delete from queue"
                    className="hidden rounded-sm group-focus-within:block group-hover:block"
                    onClick={() => updateQueue(queue.filter((_, j) => i !== j))}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  updateQueue([])
                }}
                title={'Clear queue'}
                className="group flex w-full items-center justify-between rounded-sm p-1 hover:bg-red-500"
              >
                Clear queue
              </button>
            </Popover.Panel>
          </Popover>
        )}
        <VolumeControl audioRef={audioPlayerRef} />
      </div>
    </div>
  )
}

export default AudioPlayer

interface AudioElementProps {
  duration: number
  type: string
  src: string
  audioRef: RefObject<HTMLAudioElement>
  autoplay?: boolean
  next?: () => void
  id: string | number
}

const AudioElement = React.forwardRef<HTMLAudioElement, AudioElementProps>(
  (
    { duration, src, audioRef, type, autoplay = false, next = () => null, id },
    ref
  ) => {
    const [totalTime, setTotalTime] = useState(duration)
    const [currentTime, setCurrentTime] = useState(0)
    const [buffered, setBuffered] = useState<TimeRanges>()

    // gets played time and sets if the id matches
    function loadFromLocalStorage() {
      let played = localStorage.getItem('played')

      if (played && played !== 'undefined') {
        let parsed = JSON.parse(played)

        if (parsed && parsed.id === id && audioRef.current) {
          audioRef.current.currentTime = parsed.played || 0
        }
      }
    }

    // saves current podcast progress
    function saveToLocalStorage() {
      if (id) {
        localStorage.setItem(
          'played',
          JSON.stringify({
            played: currentTime,
            id: id,
          })
        )
      }
    }

    return (
      <div className="flex w-full items-center gap-1">
        <audio
          controls={false}
          autoPlay={autoplay}
          preload="auto"
          ref={ref}
          onLoadedData={(e) => {
            loadFromLocalStorage()
            setBuffered((e.currentTarget as HTMLAudioElement).buffered)
          }}
          onTimeUpdate={(e) => {
            // save progress every 30 seconds of the videi
            if (Math.round(e.currentTarget.currentTime) % 30 === 0) {
              saveToLocalStorage()
            }

            setCurrentTime(e.currentTarget.currentTime)
            setTotalTime(e.currentTarget.duration)
          }}
          onEnded={() => next()}
        >
          <source src={src} type={type} />
        </audio>

        <span className="min-w-max text-xs sm:text-xs">
          {toHHMMSS(currentTime)}
        </span>

        <AudioProgress
          buffered={buffered}
          max={totalTime}
          value={currentTime}
          onChange={(time) => {
            if (audioRef.current) {
              audioRef.current.currentTime = time
            }
          }}
        />

        <span className="min-w-max text-xs sm:text-xs">
          {toHHMMSS(totalTime)}
        </span>
      </div>
    )
  }
)

const PlaybackControl = ({
  audioRef,
  previous = () => null,
  next = () => null,
}: {
  audioRef: RefObject<HTMLAudioElement>
  previous?: () => void
  next?: () => void
}) => {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setPlaying(true)
      audioRef.current.onpause = () => setPlaying(false)
    }
  }, [])

  return (
    <div className="flex items-center gap-3">
      <button
        className="hover:text-black dark:hover:text-white"
        onClick={() => previous()}
      >
        <FaStepBackward size={16} className="pointer-events-none" />
      </button>
      <button
        className="hover:text-black dark:hover:text-white"
        onClick={() => {
          if (audioRef.current) {
            if (audioRef.current.currentTime > 5) {
              audioRef.current.currentTime -= 5
            } else {
              audioRef.current.currentTime = 0
            }
          }
        }}
      >
        <FaBackward size={16} className="pointer-events-none" />
      </button>
      <button
        onClick={() => {
          if (audioRef.current) {
            audioRef.current.paused
              ? audioRef.current.play()
              : audioRef.current.pause()
          }
        }}
        className="grid scale-95 place-content-center rounded-full bg-white p-2 drop-shadow hover:scale-100 hover:text-black dark:bg-gray-800 dark:hover:text-white"
      >
        {playing ? (
          <FaPause size={24} className="pointer-events-none" />
        ) : (
          <FaPlay size={24} className="pointer-events-none translate-x-0.5" />
        )}
      </button>
      <button
        className="hover:text-black dark:hover:text-white"
        onClick={() => {
          if (audioRef.current) {
            if (audioRef.current.duration - audioRef.current.currentTime < 5) {
              audioRef.current.currentTime = audioRef.current.duration
            } else {
              audioRef.current.currentTime += 5
            }
          }
        }}
      >
        <FaForward size={16} className="pointer-events-none" />
      </button>
      <button
        className="hover:text-black dark:hover:text-white"
        onClick={() => next()}
      >
        <FaStepForward size={16} className="pointer-events-none" />
      </button>
    </div>
  )
}

const VolumeControl = ({
  audioRef,
}: {
  audioRef: RefObject<HTMLAudioElement>
}) => {
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onvolumechange = (e) => {
        setVolume(
          (e.target as HTMLAudioElement).muted
            ? 0
            : (e.target as HTMLAudioElement).volume
        )
      }
    }
  }, [])

  return (
    <>
      {/* volume controls for small screen */}
      <Popover className="relative sm:hidden">
        <Popover.Button className="grid place-content-center hover:text-black dark:hover:text-white">
          {volume === 0 ? (
            <FaVolumeMute size={20} className="pointer-events-none" />
          ) : volume < 0.33 ? (
            <FaVolumeOff size={20} className="pointer-events-none" />
          ) : volume < 0.66 ? (
            <FaVolumeDown size={20} className="pointer-events-none" />
          ) : (
            <FaVolumeUp size={20} className="pointer-events-none" />
          )}
        </Popover.Button>

        <Popover.Panel
          // static
          className="absolute bottom-6 right-0 h-32 rounded border border-gray-600 bg-gray-600 p-2 drop-shadow"
        >
          <Range
            vertical
            max={1}
            value={volume}
            onChange={(value) => {
              if (audioRef.current) {
                audioRef.current.volume = value
              }
            }}
          />
        </Popover.Panel>
      </Popover>

      {/* for larger screens */}
      <button
        className="hidden hover:text-black dark:hover:text-white sm:block"
        onClick={() => {
          if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted
          }
        }}
      >
        {volume === 0 ? (
          <FaVolumeMute size={20} className="pointer-events-none" />
        ) : volume < 0.33 ? (
          <FaVolumeOff size={20} className="pointer-events-none" />
        ) : volume < 0.66 ? (
          <FaVolumeDown size={20} className="pointer-events-none" />
        ) : (
          <FaVolumeUp size={20} className="pointer-events-none" />
        )}
      </button>

      <Range
        className="hidden sm:block"
        max={1}
        value={volume}
        onChange={(value) => {
          if (audioRef.current) {
            audioRef.current.volume = value
          }
        }}
      />
    </>
  )
}

const AudioProgress = ({
  max,
  value,
  onChange,
  buffered,
}: {
  max: number
  value: number
  onChange: (value: number) => void
  buffered?: TimeRanges
}) => {
  return (
    <>
      <div
        onPointerMove={(e) => {
          if (e.buttons > 0 || e.pressure > 0) {
            onChange(
              (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * max
            )
          }
        }}
        onPointerDown={(e) => {
          onChange((e.nativeEvent.offsetX / e.currentTarget.clientWidth) * max)
        }}
        className={`relative h-2 w-full cursor-pointer overflow-hidden rounded-xl bg-gray-800/25 dark:bg-gray-200/25`}
      >
        <div
          style={{
            width: `${(value / max) * 100}%`,
          }}
          className="pointer-events-none absolute top-0 z-20 h-2 bg-gray-800  dark:bg-gray-200"
        />

        {/* shows the positions where media is loaded */}
        {/*
          [
            // this part has been loaded from 15s to 20s
            {
              start: 15, // get this using buffered.start(0)
              end: 20 // get this using buffered.end(0)
            },
            // this part has been loaded from 30s to 40s
            {
              start: 30, // get this using buffered.start(1)
              end: 40 // get this using buffered.end(1)
            }
          ]
        */}

        {buffered &&
          buffered.length > 0 &&
          Array(buffered.length)
            .fill('')
            .map((_, i) => (
              <div
                style={{
                  width: `${
                    ((buffered.end(0) - buffered.start(0)) / max) * 100
                  }%`,
                  // (divRef.current?.clientWidth! *
                  //   (buffered.end(i) - buffered.start(i))) /
                  //   max || 0,
                  marginLeft: `${(buffered.start(i) / max) * 100}&`,
                  // (divRef.current?.clientWidth! * buffered.start(i)) / max ||
                  // 0,
                }}
                key={i}
                className="pointer-events-none absolute top-0 h-2 bg-gray-800/50  dark:bg-gray-200/50"
              />
            ))}
      </div>
    </>
  )
}

export const Range = ({
  max,
  value,
  onChange,
  vertical = false,
  className = '',
}: {
  max: number
  value: number
  vertical?: boolean
  onChange: (value: number) => void
  className?: string
}) => {
  function changeHandler(e: React.PointerEvent<HTMLDivElement>) {
    if (vertical) {
      onChange((1 - e.nativeEvent.offsetY / e.currentTarget.clientHeight) * max)
    } else {
      onChange((e.nativeEvent.offsetX / e.currentTarget.clientWidth) * max)
    }
  }

  return (
    <>
      {vertical ? (
        <div
          onPointerMove={(e) => {
            if (e.buttons > 0 || e.pressure > 0) {
              changeHandler(e)
            }
          }}
          onPointerDown={(e) => {
            changeHandler(e)
          }}
          className={`group relative h-full w-2 cursor-pointer rounded-xl bg-gray-800/25 dark:bg-gray-200/25 ${className}`}
        >
          <div
            style={{
              height: `${(value / max) * 100}%`,
            }}
            className="pointer-events-none absolute bottom-0 z-20 w-2 rounded-xl bg-gray-800 group-hover:bg-black dark:bg-gray-200 dark:group-hover:bg-white"
          />
        </div>
      ) : (
        <div
          onPointerMove={(e) => {
            if (e.buttons > 0 || e.pressure > 0) {
              changeHandler(e)
            }
          }}
          onPointerDown={(e) => {
            changeHandler(e)
          }}
          className={`group relative h-2 w-full cursor-pointer rounded-xl bg-gray-800/25 dark:bg-gray-200/25 ${className}`}
        >
          <div
            style={{
              width: `${(value / max) * 100}%`,
            }}
            className="pointer-events-none absolute top-0 z-20 h-2 rounded-xl bg-gray-800 group-hover:bg-black dark:bg-gray-200 dark:group-hover:bg-white"
          />
        </div>
      )}
    </>
  )
}

export const toHHMMSS = (e: number, del = ':') => {
  if (e <= 0) return '0:00'
  let h: any = Math.floor(e / 3600)
  if (h > 0) {
    h = h.toString().padStart(2, '0')
  } else {
    h = ''
  }
  let m = Math.floor((e % 3600) / 60).toString()
  //.padStart(2, "0");
  let s = Math.floor(e % 60)
    .toString()
    .padStart(2, '0')

  return (h !== '' ? `${h}${del}` : '') + m + del + s
}
