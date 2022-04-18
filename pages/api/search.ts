import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import apiHeaders from '../../utils/apiHeaders'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { q = '', mode = '' } = req.query

    if (mode === 'tag') {
      let tags = String(q).trim().split(' ')
      let included_tags = tags.filter((tag) => !tag.startsWith('-')).join(',')
      let notincluded_tags = tags.filter((tag) => tag.startsWith('-')).join(',')

      let data = await axios({
        method: 'get',
        url: 'https://api.podcastindex.org/api/1.0/recent/feeds',
        headers: apiHeaders(),
        params: {
          pretty: true,
          cat: included_tags,
          notcat: notincluded_tags,
        },
      })

      res.status(200).json(data.data)
    } else {
      let data = await axios({
        method: 'get',
        url: 'https://api.podcastindex.org/api/1.0/search/byterm',
        headers: apiHeaders(),
        params: {
          pretty: null,
          q: q,
        },
      })
      res.status(200).json(data.data)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occured' })
  }
}
