const express = require('express')
const bodyParser = require('body-parser')
const registerRouter = require('./router')

const port = process.env.PORT || 9002

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


registerRouter(app)

// 静态资源服务
app.use(express.static('../dist'))


app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://127.0.0.1:' + port + '\n')
})
