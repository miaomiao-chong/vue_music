const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const csrf = require('xsrf')
const bodyParser = require('body-parser')
const registerRouter = require('./router')

const port = process.env.PORT || 9002

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// const csrfProtection = csrf({
//   cookie: true,
//   ignoreMethods: ['HEAD', 'OPTIONS'],
//   checkPathReg: /^\/api/
// })
// app.use(cookieParser())
// app.use(csrfProtection)

app.get('/', function (req, res, next) {
  // res.cookie('XSRF-TOKEN', req.csrfToken())
  return next()
})

registerRouter(app)

// app.use(compression())

app.use(express.static('../dist'))

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next()
  }

  // handle CSRF token errors here
  res.status(403)
  res.send('<p>接口已经被我用 CSRF 保护了</p>')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://127.0.0.1:' + port + '\n')
})
