import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaExternalLinkAlt, FaHeart, FaRegHeart } from 'react-icons/fa'
import { Feed, Podcast } from '../utils/types'

const PodcastHeader = ({
  podcast,
  showDescription = true,
}: {
  podcast: Podcast
  showDescription?: boolean
}) => {
  const [isFavourite, setIsFavourite] = useState<boolean | null>(null)

  useEffect(() => {
    const favourites = localStorage.getItem('favourites')
    const parsedFavourites: Feed[] = favourites ? JSON.parse(favourites) : []

    if (parsedFavourites.find((fav) => fav.id === podcast.feed.id)) {
      setIsFavourite(true)
    } else {
      setIsFavourite(false)
    }
  }, [])

  function toggleFavourite() {
    const favourites = localStorage.getItem('favourites')
    const parsedFavourites: Feed[] = favourites ? JSON.parse(favourites) : []

    if (isFavourite) {
      localStorage.setItem(
        'favourites',
        JSON.stringify(
          parsedFavourites.filter((item) => item.id !== podcast.feed.id)
        )
      )
      setIsFavourite(false)
    } else {
      let feed = podcast.feed

      let favouriteInfo = {
        id: feed.id,
        url: feed.url,
        title: feed.title,
        description: feed.description,
        image: feed.image,
        itunesId: feed.itunesId,
        language: feed.language,
        categories: feed.categories,
      }

      localStorage.setItem(
        'favourites',
        JSON.stringify([...parsedFavourites, favouriteInfo])
      )
      setIsFavourite(true)
    }
  }

  return (
    <div>
      <div className="flex gap-3">
        <img className="h-32 w-32" src={podcast.feed.image} />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link href={`/podcast/${podcast.feed.id}`}>
              <a className="break-all text-xl font-bold hover:underline sm:break-normal sm:text-2xl">
                {podcast.feed.title}
              </a>
            </Link>

            {isFavourite !== null && (
              <button
                title={
                  isFavourite ? 'Remove from favourites' : 'Add to Favourites'
                }
                className="grid place-content-center  sm:text-xl"
                onClick={() => toggleFavourite()}
              >
                {isFavourite ? <FaHeart /> : <FaRegHeart />}
              </button>
            )}
          </div>

          <div>
            <Link href={podcast.feed.link}>
              <a
                target="_blank"
                className="flex items-center gap-1 break-all text-sm sm:break-normal"
              >
                {podcast.feed.link}
                <FaExternalLinkAlt size={12} />
              </a>
            </Link>
          </div>

          <p>{podcast.feed.author}</p>

          <p className="flex flex-wrap gap-2">
            {podcast?.feed?.categories &&
              Object.values(podcast.feed.categories).map((category, i) => (
                <Link href={`/tag/${category}`} key={'category' + i}>
                  <a className="rounded-xl bg-gray-400 px-2 text-sm">
                    {category}
                  </a>
                </Link>
              ))}
          </p>
        </div>
      </div>

      {showDescription && (
        <div className="py-3 text-sm">{podcast.feed.description}</div>
      )}
    </div>
  )
}

export default PodcastHeader
