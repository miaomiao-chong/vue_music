import { post } from './base'
export function getSongUrl(songs) {
  return post('/api/getSongUrl', songs).then((res) => {
    // console.log("test", res);
    const map = res
    return songs.mid.map((song) => {
      // const id = JSON.stringify(song.id)
      const id = song.id
      song.url = map[id]
      // console.log(song.url);
      return song
    })
  })
}
