import { get } from "@/service/base";

export function getTopList() {
  return get('/api/getTopList')
}

export function getTopDetail(toplistID) {
  return get('/api/getTopDetail', {
    id: toplistID,
    cookie: 'NMTID=00ObtYbvg32zLcqjk6Tqj2Px63cLCIAAAF8RhAK6A'
  })
}
