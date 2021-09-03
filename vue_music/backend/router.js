const axios = require('axios')

const ERR_OK = 200
const baseUrl = 'http://47.103.29.206:3000'

function registerRouter(app){
  registerbanner(app),
  registerPlayslist(app)
}
// 推荐
function registerbanner(app){
  app.get('/api/getBanner', (req, res)=>{
    const url = `${baseUrl}/banner`
    const query = req.query
    axios.get(url, query).then((result)=>{
      const data=result.data
      // console.log(result);
      // res.json(result.data)
      if(data.code===ERR_OK) {
        const banners=data.banners
        const sliders = []
        for(let i = 0;i<6;i++){
          let sliderItem = {}
          sliderItem.pic=banners[i].imageUrl
          sliderItem.url=banners[i].url
          sliderItem.targetId=banners[i].targetId
          sliderItem.targetType=banners[i].targetType
          sliderItem.typeTitle=banners[i].typeTitle
          sliderItem.titleColor=banners[i].titleColor
          sliders.push(sliderItem)
        }
        res.json({
          code: ERR_OK,
          result: {
            sliders
          }
        })
      }else{
        res.json('出错了')
      }
    })
  })
}

// 推荐歌单
function registerPlayslist(app){
  app.get('/api/getPlaylist', (req, res) => {
    const url = `${baseUrl}/top/playlist/highquality`
    const params = req.query
    params.limit=Number(params.limit)
    console.log("params", params);
    axios.get(url, {params}).then((playlist) => {
      const data=playlist.data
      console.log(playlist)
      // console.log(data);
      // res.json(result.data)
      playlist= playlist.data.playlists
      console.log('playlists', playlist);
      let playlistArr=[]
      for(let i=0; i<playlist.length; i++){
        let playlistData = {}
        playlistData.id = playlist[i].id
        playlistData.username = playlist[i].name
        playlistData.title = playlist[i].copywriter
        playlistData.pic = playlist[i].coverImgUrl
        playlistArr.push(playlistData)
      }
      if(data.code===ERR_OK) {
        res.json({
          code: ERR_OK,
          result: {
            playlistArr
          }
        })
      }else{
        res.json('出错了')
      }
    })
  })
}

module.exports = registerRouter