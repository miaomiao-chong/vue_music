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

export function getAlbum(albumId) {
  return get('/api/getAlbum', {
    id: albumId,
    cookie: 'NMTID=00ObtYbvg32zLcqjk6Tqj2Px63cLCIAAAF8RhAK6A'
})
}
