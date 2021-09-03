import { get } from './base'

export function getBanner() {
  return get('/api/getBanner', {
    type: 1
  })
}
export function getPlaylist() {
  return get('/api/getPlaylist', {
    limit: 10
  })
}
