import { get } from './base'

export function getHotKeys() {
  return get('/api/getHotKeys')
}

export function getSearchList(keywords, limit, offset) {
  return get('/api/getKeywordRes', {
    keywords,
    limit,
    offset
  })
}

export function getOneSongDetail(mid) {
  return get('/api/oneSong', { mid: mid })
}
