import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import apiHeaders from '../../../../utils/apiHeaders'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { podcastid } = req.query
    let { data } = await axios({
      method: 'GET',
      url: `https://api.podcastindex.org/api/1.0/podcasts/byfeedid?id=${podcastid}&pretty`,
      headers: apiHeaders(),
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'An error occured' })
  }
}
