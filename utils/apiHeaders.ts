import crypto from 'crypto'

export default function apiHeaders() {
  let apiHeaderTime = Math.floor(Date.now() / 1000)
  let sha1Hash = crypto
    .createHash('sha1')
    .update(process.env.API_KEY! + process.env.API_SECRET! + apiHeaderTime)
    .digest('hex')

  return {
    'X-Auth-Date': '' + apiHeaderTime,
    'X-Auth-Key': process.env.API_KEY!,
    Authorization: sha1Hash,
    'User-Agent': 'devjampodcast/1.8',
  }
}
