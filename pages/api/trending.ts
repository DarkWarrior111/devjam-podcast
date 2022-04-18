// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import apiHeaders from '../../utils/apiHeaders'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const limit = req.query.limit

  try {
    let data = await axios({
      method: 'get',
      url: `https://api.podcastindex.org/api/1.0/podcasts/trending?max=${limit}&lang=en&pretty`,
      headers: apiHeaders(),
    })
    res.status(200).json(data.data)
  } catch (error) {
    res.status(500).json({ message: 'An error occured' })
  }
}
