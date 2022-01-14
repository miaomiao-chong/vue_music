import axios from 'axios'

// const baseUrl = '/'
// const baseUrl = process.env.NODE_ENV === 'production' ? "http://127.0.0.1:9002" : '/'
const baseUrl = process.env.NODE_ENV === 'production' ? "http://47.103.29.206:9002/" : '/'
// const baseUrl = process.env.NODE_ENV === 'production' ? "http://127.0.0.1:9002/" : '/'

axios.defaults.baseURL = baseUrl

export function get(url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    // const serverData = res
    return res
  }).catch((err) => {
    console.log(err)
  })
}

export function post(url, data) {
  return axios.post(url, data).then((res) => {
    return res.data.result
  })
}
