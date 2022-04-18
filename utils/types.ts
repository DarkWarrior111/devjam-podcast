export interface PodcastIndexTrending {
  status: string
  feeds: Feed[]
  count: number
  max: number
  since: number
  description: string
}

export interface Feed {
  id: number
  url: string
  title: string
  description: string
  author: string
  image: string
  newestItemPublishedTime: number
  itunesId: number
  trendScore: number
  language: string
  categories: { [key: string]: string }
}

export interface Podcast {
  status: string
  query: Query
  feed: FeedExtended
  description: string
}

export interface FeedExtended {
  id: number
  podcastGuid: string
  title: string
  url: string
  originalUrl: string
  link: string
  description: string
  author: string
  ownerName: string
  image: string
  artwork: string
  lastUpdateTime: number
  lastCrawlTime: number
  lastParseTime: number
  lastGoodHttpStatusTime: number
  lastHttpStatus: number
  contentType: string
  itunesId: number
  generator: string
  language: string
  type: number
  dead: number
  chash: string
  episodeCount: number
  crawlErrors: number
  parseErrors: number
  categories: { [key: string]: string }
  locked: number
  imageUrlHash: number
  value: Value
  funding: Funding
}

export interface Funding {
  url: string
  message: string
}

export interface Value {
  model: Model
  destinations: Destination[]
}

export interface Destination {
  name: string
  address: string
  type: string
  split: number
  fee: boolean
}

export interface Model {
  type: string
  method: string
  suggested: string
}

export interface Query {
  id: string
}

export interface PodcastEpisodes {
  status: string
  items: Episode[]
  count: number
  query: string
  description: string
}

export interface Episode {
  id: number
  title: string
  link: string
  description: string
  guid: string
  datePublished: number
  datePublishedPretty: string
  dateCrawled: number
  enclosureUrl: string
  enclosureType: string
  enclosureLength: number
  duration: number
  explicit: 0 | 1
  episode: number
  episodeType: 'full' | 'bonus' | 'trailer'
  season: number
  image: string
  feedItunesId: number
  feedImage: string
  feedId: number
  feedLanguage: string
  feedDead: number
  feedDuplicateOf: null
  chaptersUrl: null
  transcriptUrl: null
}
