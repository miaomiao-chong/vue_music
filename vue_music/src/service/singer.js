import { get, post } from './base'
export function getSingerList() {
  return get('/api/singer')
}

export function getSingerDetail(singer) {
  return get('/api/getSingerDetail', { id: singer.id })
}