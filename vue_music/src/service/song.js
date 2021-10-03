import { post } from './base'

export function getSongUrl(songs) {
  return post('/api/getSongUrl', songs).then((res) => {
    console.log("test", res);
    const map = res
    // console.log("songs=====", songs)
    songs = songs.mid
    for (let i = 0; i < songs.length; i++) {
      // console.log(songs[i])
      // console.log(map[songs[i].id])
    }
    // if (map) {
    //   console.log("res.length!==0")
    //   console.log("map", map[songs[0].id])
    //   console.log(songs.length, songs[0])
    //   setTimeout(() => {
    //     for (let i = 0; i < songs.length; i++) {
    //       songs[i].url = map[songs[i].id]
    //       console.log('-----', map[songs[i].id])
    //     }
    //     return songs
    //   })
    // } else {
    //   console.log("fdsafdsa")
    // }
  });
}
