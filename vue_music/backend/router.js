const axios = require('axios')

const ERR_OK = 200
const baseUrl = 'http://47.103.29.206:3000'

function registerRouter(app){
  registerbanner(app)
}
// 推荐
function registerbanner(app){
  app.get('/api/getBanner', (req, res)=>{
    const url = `${baseUrl}/banner`
    const params = {
      type: 1
    }
    axios.get(url, {
      params
    }).then((result)=>{
      const data=result.data
      // console.log(result);
      // res.json(result.data)
      if(data.code===ERR_OK) {
        const banners=data.banners
        const sliders = []
        for(let i = 0;i<5;i++){
          let sliderItem = {}
          sliderItem.pic=banners[i].pic
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
module.exports = registerRouter