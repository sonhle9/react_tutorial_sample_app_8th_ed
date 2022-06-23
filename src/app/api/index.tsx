import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

let BASE_URL = ''
console.log('env', process.env)
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:3003/api'
} else {
  BASE_URL = 'https://railstutorialapi.herokuapp.com/api'
}

axios.defaults.xsrfCookieName = 'CSRF-TOKEN'

axios.defaults.xsrfHeaderName = 'X-CSRF-Token'

axios.defaults.withCredentials = true

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-lang': 'EN'
  },
})

API.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    if (
      localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined'
    ) 
    {
      config.headers!.Authorization = `Bearer ${localStorage.getItem('token')} ${localStorage.getItem('remember_token')}`
    }
    else if (
      sessionStorage.getItem('token') && sessionStorage.getItem('token') !== 'undefined'
    ) 
    {
      config.headers!.Authorization = `Bearer ${sessionStorage.getItem('token')} ${sessionStorage.getItem('remember_token')}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

API.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default API