const pinyin = require('pinyin')
const CODE_OK = 200
const axios = require('axios')
const baseUrl = 'http://47.103.29.206:3000'
const cookie = 'MUSIC_U=675fb74408213020288a334790de3971b87f628b7d8fb6ae85721bab949eee9c33a649814e309366; Max-Age=1296000; Expires=Tue 9 Feb 2021 07:24:23 GMT; Path=/'
const LocalUrl = 'http://localhost:8081'

// const baseSongPic = 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'

function registerRouter(app) {
  // eslint-disable-next-line no-unused-expressions,no-sequences
  registerbanner(app),
    registerPlayslist(app),
    registerSingerList(app),
    registerSingerDetail(app),
    registerSongUrl(app),
    registerLyric(app)
  registerAlbum(app)
  registerTopList(app)
  // registerTopDetail(app)
}

// 推荐slider
function registerbanner(app) {
  app.get('/api/getBanner', (req, res) => {
    const url = `${baseUrl}/banner`
    const query = req.query
    axios.get(url, query).then((result) => {
      const data = result.data
      // console.log(result);
      // res.json(result.data)
      if (data.code === CODE_OK) {
        const banners = data.banners
        const sliders = []
        for (let i = 0; i < 6; i++) {
          let sliderItem = {}
          sliderItem.pic = banners[i].imageUrl
          sliderItem.url = banners[i].url
          sliderItem.targetId = banners[i].targetId
          sliderItem.targetType = banners[i].targetType
          sliderItem.typeTitle = banners[i].typeTitle
          sliderItem.titleColor = banners[i].titleColor
          sliders.push(sliderItem)
        }

        res.json({
          code: CODE_OK,
          result: {
            sliders
          }
        })
      } else {
        res.json('出错了')
      }
    })
  })
}

// 推荐歌单
function registerPlayslist(app) {
  app.get('/api/getPlaylist', (req, res) => {
    // console.log(123)
    const url = `${baseUrl}/top/playlist/highquality`
    const params = req.query
    params.limit = Number(params.limit)
    // console.log("params", params);
    axios.get(url, { params }).then((playlist) => {
      const data = playlist.data
      // console.log(playlist)
      // console.log(data);
      // res.json(result.data)
      playlist = playlist.data.playlists
      // console.log('playlists', playlist);
      if (data.code === CODE_OK) {
        let playlistArr = []
        for (let i = 0; i < playlist.length; i++) {
          let playlistData = {}
          playlistData.id = playlist[i].id
          playlistData.username = playlist[i].name
          playlistData.title = playlist[i].copywriter
          playlistData.pic = playlist[i].coverImgUrl
          playlistArr.push(playlistData)
        }
        res.json({
          code: CODE_OK,
          result: {
            playlistArr
          }
        })
      } else {
        res.json('出错了')
      }
    })
  })
}

// 歌手数据
function registerSingerList(app) {
  app.get('/api/singer', (req, res) => {
    const HOT_NAME = '热'
    console.log(123)
    const url = `${baseUrl}/top/artists`
    const params = req.query
    params.limit && (params.limit = Number(params.limit))
    params.offset && Number(params.offset)
    // console.log(params);
    axios.get(url, { params }).then((result) => {
      const artists = result.data.artists
      // 过滤接收到的数据
      const artistList = artists.map((item) => {
        return {
          id: item.id,
          name: item.name,
          picUrl: item.picUrl
        }
      })
      // 初始化singerMap
      const singerMap = {
        hot: {
          title: HOT_NAME,
          list: artistList.slice(0, 6)
        }
      }
      // 把歌手对应的首字母作为key push到singerMap
      artistList.forEach((item) => {
        // 把歌手名转换成拼音  找出拼音的首字母就知道歌手属于哪个字母了
        const p = pinyin(item.name)
        if (!p || !p.length) {
          return
        }
        // console.log(p);
        const key = p[0][0].slice(0, 1).toUpperCase()
        if (key) {
          // 没有当前字母
          if (!singerMap[key]) {
            singerMap[key] = {
              title: key,
              list: []
            }
          }
        }
        // push相应歌手到对应key的list下面
        singerMap[key].list.push(item)
      })
      // console.log(result.data);
      // console.log(artistList)
      // 遍历处理 singerMap 让结果有序
      const hot = []
      const letter = []
      for (const key in singerMap) {
        const item = singerMap[key]
        if (item.title.match(/[a-zA-Z]/)) {
          letter.push(item)
        } else if (item.title == HOT_NAME) {
          hot.push(item)
        }
      }
      // 按字母顺序排序
      letter.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // console.log(letter);
      res.json({
        result: hot.concat(letter),
        code: CODE_OK
      })
    }).catch((err) => {
      console.log(err);
    })
  })
}

// 歌手点击进去歌手歌曲页面
function registerSingerDetail(app) {
  app.get('/api/getSingerDetail', (req, res) => {
    console.log("歌手点击进去歌手歌曲页面")
    const params = req.query
    // console.log(params)
    const url = `${baseUrl}/artist/top/song`
    axios.get(url, { params }).then((result) => {
      const data = result.data.songs
      const songList = handleSongList(data)
      // console.log("songLIst.length", songList)
      res.json({
        result: songList
      })
    })
  })
}

// 获取歌曲url   可以和获取歌手合并
function registerSongUrl(app) {
  app.post('/api/getSongUrl', async (req, res) => {
    // console.log(req.body);
    let mid = req.body.mid
    // console.log("mid", mid)
    process(mid)
    // console.log("result", result);
    // console.log('获取歌曲url');
    // console.log("mid", mid[0]);
    res.json({
      result: mid,
      code: CODE_OK
    })
  })

  // 处理返回的id
  function process(info) {
    // console.log("processId :", info[0])
    for (let i = 0; i < info.length; i++) {
      info[i].url = `https://music.163.com/song/media/outer/url?id=${info[i].id}.mp3`
    }
  }
}

function registerLyric(app) {
  app.get('/api/getLyric', (req, res) => {
    const params = req.query
    const url = `${baseUrl}/lyric`
    axios.get(url, { params }).then((result) => {
      // console.log(result.data)
      res.json({
        code: CODE_OK,
        result: (result.data.lrc && result.data.lrc.lyric) || ''
      })
    })
  })
}

function mergeSinger(singer) {
  if (singer.length === 0 || !singer) {
    return
  }
  const singerMerge = []
  singer.forEach((item) => {
    singerMerge.push(item.name)
  })
  return singerMerge.join('/')
}

// 获取歌单专辑数据
function registerAlbum(app) {
  app.get('/api/getAlbum', (req, res) => {
    // 专辑id
    // console.log(req.query)
    const params = req.query
    const url = `${baseUrl}/playlist/detail`
    axios.get(url, {
      params,
      headers: { cookie: cookie }
    }).then((response) => {
      // console.log("res:", response)
      let songList = response.data.playlist.tracks
      songList = handleSongList(songList)
      res.json({
        result: songList
      })
    })
  })
}

// 获取榜单数据
function registerTopList(app) {
  app.get('/api/getTopList', (req, res) => {
    const url = `${baseUrl}/toplist/detail`
    axios.get(url).then((response) => {
      // console.log(app)
      const list = response.data.list
      let filteredList = []
      list.forEach((item) => {
        filteredList.push({
          name: item.name,
          id: item.id,
          coverImgUrl: item.coverImgUrl,
          songList: item.tracks.map((songItem) => {
            return {
              songName: songItem.first,
              singerName: songItem.second
            }
          })
        })
      })
      const promiseArr = []
      for (let i = 0; i < filteredList.length; i++) {
        let songListItem = filteredList[i].songList
        if (songListItem.length === 0) {
//    axios返回值是一个Promise对象
          const promise = axios.get('http://127.0.0.1:8081/api/getAlbum', {
            params: {
              id: filteredList[i].id
            }
          }).then((res) => {
            const songDetailList = res.data.result.slice(0, 3)
            // songListItem=[...songDetailList]   // 不行，地址会发生变化
            for (let i = 0; i < songDetailList.length; i++) {
              const item = {
                songName: songDetailList[i].name,
                singerName: songDetailList[i].singer
              }
              songListItem.push(item)
            }
            // 可以看到这里有数据
            // console.log(filteredList[i].songList);
            return 1
          }).catch(err => {
            console.log(err);
          })
          promiseArr.push(promise)
        }
      }
      // console.dir(promiseArr);  放Promise对象的一个数组
      // 请求数据太多，响应有点慢
      Promise.all(promiseArr).then((e) => {
        console.log("ee", e);
        res.json({
          result: {
            filteredList
          }
        })
      })
    })
  })
}

// 获取歌单详情
// function registerTopDetail(app) {
//   app.get("/api/getTopDetail", (req, res) => {
//     const url = baseUrl + '/playlist/detail'
//     axios.get(url, {
//       params: {
//         id: req.query.id
//       }
//     }).then((e) => {
//       console.log("res", e.data)
//       res.json({
//         result: {
//           playlist: e.data.playlist.privileges
//         }
//
//       })
//     })
//   })
// }

// 对songList进行处理
function handleSongList(list) {
  const songList = []
  // console.log("list.length", list.length)
  list.forEach((item) => {
    const singer = mergeSinger(item.ar)
    const id = item.id
    const name = item.name
    const url = ''
    const pic = item.al.picUrl
    const album = item.al.name
    const alId = item.al.id
    const songItem = {
      singer,
      id,
      name,
      url,
      pic,
      album,
      alId
    }
    // console.log("songitem", songItem)
    songList.push(songItem)
  })
  return songList
}

module.exports = registerRouter
