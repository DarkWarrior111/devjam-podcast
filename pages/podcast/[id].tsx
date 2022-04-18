import { Menu } from '@headlessui/react'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortNumericDown,
  FaSortNumericDownAlt,
  FaSortNumericUp,
} from 'react-icons/fa'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import ErrorMessage from '../../Components/ErrorMessage'
import PodcastEpisode from '../../Components/PodcastEpisode'
import PodcastHeader from '../../Components/PodcastHeader'
import { usePlayer } from '../../Components/PlayerContext'
import {
  PodcastEpisodeSkeleton,
  PodcastHeaderSkeleton,
} from '../../Components/Skeletons'
import apiHeaders from '../../utils/apiHeaders'
import { Podcast, PodcastEpisodes } from '../../utils/types'

const Podcast = ({ podcast: sspPodcast }: { podcast: Podcast }) => {
  const {
    query: { id },
  } = useRouter()

  const {
    isLoading,
    isError,
    data: podcast,
    refetch,
  } = useQuery<Podcast>(
    ['Podcast', id],
    async () => {
      try {
        let { data } = await axios({
          baseURL: window.location.origin,
          url: `/api/podcast/${id}`,
        })

        return data
      } catch (error) {
        throw error
      }
    },
    {
      cacheTime: 1000 * 60 * 60,
      staleTime: 1000 * 60 * 60,
      enabled: !!id,
      initialData: sspPodcast,
    }
  )

  const {
    isLoading: isLoadingEpisodes,
    isError: isErrorEpisodes,
    data: episodes,
    refetch: refetchEpisodes,
  } = useQuery<PodcastEpisodes>(
    ['Podcast Episodes', id],
    async () => {
      try {
        let { data } = await axios({
          baseURL: window.location.origin,
          url: `/api/podcast/${id}/episodes`,
        })

        return data
      } catch (error) {
        throw error
      }
    },
    {
      cacheTime: 1000 * 60 * 60,
      staleTime: 1000 * 60 * 60,
      enabled: !!id,
    }
  )

  const { updateQueue } = usePlayer()

  return (
    <>
      <Head>
        {podcast && (
          <title>
            {podcast.feed.title}{' '}
            {podcast.feed.author ? ' | ' + podcast.feed.author : ''}{' '}
          </title>
        )}
      </Head>

      <div className="bg-gray-300 p-5 text-gray-800 shadow dark:bg-gray-900 dark:text-gray-100">
        {isLoading && <PodcastHeaderSkeleton />}
        {isError && <ErrorMessage message="An error occured" retry={refetch} />}

        {podcast && <PodcastHeader podcast={podcast} />}
      </div>

      <div className="mx-3 my-3 space-y-3 dark:text-white sm:mx-5">
        <div className="flex items-end justify-between">
          <h3 className="text-lg font-bold">
            Episodes{' '}
            {episodes && (
              <span className="text-sm text-gray-700 dark:text-gray-200">
                (
                {podcast && podcast.feed.episodeCount > episodes.count
                  ? podcast?.feed.episodeCount
                  : episodes.count}
                )
              </span>
            )}
          </h3>
          {episodes && (
            <Menu as="div" className="relative">
              <Menu.Button className="text-sm text-gray-700 dark:text-gray-200">
                Play all
              </Menu.Button>
              <Menu.Items className="absolute top-6 right-0 z-10 rounded border bg-gray-300 p-1 drop-shadow dark:bg-gray-800">
                <Menu.Item
                  onClick={() => {
                    let items = [...episodes.items]
                    updateQueue(items.reverse())
                  }}
                >
                  {({ active }) => (
                    <div
                      className={`mr-2 flex w-full min-w-max cursor-pointer items-center gap-1 rounded p-1 ${
                        active ? 'bg-gray-200 dark:bg-gray-900' : ''
                      }`}
                    >
                      <FaSortNumericDown
                        className="pointer-events-none"
                        size={20}
                      />
                      From start
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item onClick={() => updateQueue(episodes.items)}>
                  {({ active }) => (
                    <div
                      className={`mr-2 flex w-full min-w-max cursor-pointer items-center gap-1 rounded p-1 ${
                        active ? 'bg-gray-200 dark:bg-gray-900' : ''
                      }`}
                    >
                      <FaSortNumericDownAlt
                        className="pointer-events-none"
                        size={20}
                      />
                      From last
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          )}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {episodes?.items.map((episode) => (
            <PodcastEpisode episode={episode} key={episode.id} />
          ))}
          {isLoadingEpisodes &&
            Array(3)
              .fill('')
              .map((_, i) => <PodcastEpisodeSkeleton key={i} />)}
        </div>

        {isError && (
          <ErrorMessage message="An error occured" retry={refetchEpisodes} />
        )}
      </div>
    </>
  )
}

export default Podcast

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    let { data } = await axios({
      method: 'GET',
      url: `https://api.podcastindex.org/api/1.0/podcasts/byfeedid?id=${ctx.query.id}&pretty`,
      headers: apiHeaders(),
    })

    return {
      props: {
        podcast: data,
      },
    }
  } catch (error) {
    return {
      props: {
        podcast: undefined,
      },
    }
  }
}
