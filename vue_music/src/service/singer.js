import { get, post } from './base'
export function getSingerList() {
  return get('/api/singer')
}

export function getSingerDetail(singer) {
  return get('/api/getSingerDetail', { id: singer.id })
}

export function getSongUrl(mid) {
  return post('/api/getSongUrl',mid)
}