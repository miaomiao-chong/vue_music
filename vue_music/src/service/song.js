import { post, get } from './base'

export function getSongUrl(songs) {
  return post('/api/getSongUrl', songs).then((res) => {
    console.log("test", res);
    // const map = res
    // console.log("songs=====", songs)
    return res
  });
}

export function getLyric(id) {
  return get('/api/getLyric', id)
}
