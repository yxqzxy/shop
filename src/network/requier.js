import axios from 'axios'

// 1.创建axios的实例
const instance = axios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
  timeout: 45000,
})

// 2.axios的拦截器
// 2.1.请求拦截的作用
instance.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, err => {
  // console.log(err);
})

// 2.2.响应拦截
instance.interceptors.response.use(res => {
  return res.data
}, err => {
  // console.log(err);
  return Promise.reject(err)
})

// 3.发送真正的网络请求
export default instance
