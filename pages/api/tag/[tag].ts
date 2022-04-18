// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import apiHeaders from '../../../utils/apiHeaders'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit = 50, tag } = req.query

  try {
    let data = await axios({
      method: 'get',
      url: `https://api.podcastindex.org/api/1.0/recent/feeds`,
      params: {
        lang: 'en',
        max: limit,
        pretty: true,
        cat: tag,
      },
      headers: apiHeaders(),
    })
    res.status(200).json(data.data)
  } catch (error) {
    res.status(500).json({ message: 'An error occured' })
  }
}
