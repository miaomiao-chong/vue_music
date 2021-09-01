import { get } from './base'

export function getBanner() {
  return get('/api/getBanner', {
    type: 1
  })
}
