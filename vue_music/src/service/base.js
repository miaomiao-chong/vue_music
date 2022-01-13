import axios from 'axios'

// const baseUrl = '/'
const baseUrl = process.env.NODE_ENV === 'production' ? "http://47.103.29.206/music" : '/'
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
