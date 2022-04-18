import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Random = () => {
  const router = useRouter()

  useEffect(() => {
    async function random() {
      try {
        let { data } = await axios({
          method: 'GET',
          baseURL: window.location.origin,
          url: '/api/randomepisode',
        })

        router.push(`/podcast/${data.episodes[0].feedId}`)
      } catch (error) {
        console.error(error)
      }
    }

    random()
  }, [])

  return null
}

export default Random
