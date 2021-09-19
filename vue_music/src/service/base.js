import axios from 'axios'

const baseUrl = '/'
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

export function post(url, item) {
  return axios.post(url, item)
}