import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import PodcastList from '../Components/PodcastList'
import { Feed } from '../utils/types'

const Favourites = () => {
  const [favourites, setFavourites] = useState({ feeds: [] as Feed[] })

  useEffect(() => {
    const favourites = localStorage.getItem('favourites')
    const parsedFavourites: Feed[] = favourites ? JSON.parse(favourites) : []

    setFavourites({ feeds: parsedFavourites })
  }, [])

  return (
    <>
      <Head>
        <title>Favourites</title>
      </Head>
      {/* @ts-ignore */}
      <PodcastList title="Favourites" podcasts={favourites} />
    </>
  )
}

export default Favourites
