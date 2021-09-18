const axios = require('axios')
const pinyin = require('pinyin')
const CODE_OK = 200
const baseUrl = 'http://47.103.29.206:3000'
const baseSongPic = 'https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg'

function registerRouter(app) {
  registerbanner(app),
    registerPlayslist(app),
    registerSingerList(app),
    registerSingerDetail(app)
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
    const url = `${baseUrl}/top/playlist/highquality`
    const params = req.query
    params.limit = Number(params.limit)
    console.log("params", params);
    axios.get(url, { params }).then((playlist) => {
      const data = playlist.data
      console.log(playlist)
      // console.log(data);
      // res.json(result.data)
      playlist = playlist.data.playlists
      console.log('playlists', playlist);
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
    const url = `${baseUrl}/top/artists`
    const params = req.query
    params.limit && (params.limit = Number(params.limit))
    params.offset && Number(params.offset)
    console.log(params);
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
      console.log(letter);
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
    const params = req.query
    const url = `${baseUrl}/artist/top/song`
    axios.get(url, { params }).then((result) => {
      const  data = result.data.songs
      const songList=[]
      data.forEach((item) => {
        const singer = mergeSinger(item.ar)
        const id = item.id
        const name = item.name
        const url = ''
        const pic = item.al.picUrl
        const album = item.al.name
        const alId = item.al.id
        const songItem = {
          singer,id,name,url,pic,album,alId
        }
        songList.push(songItem)
      })
      res.json({
        result: songList
      })
    })
  })
}

function mergeSinger(singer) {
  if (singer.length == 0 || !singer) {
    return
  }
  const singerMerge = []
  singer.forEach((item) => {
    singerMerge.push(item.name)
  })
  return singerMerge.join('/')
}
module.exports = registerRouter