import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from './token'

const http = axios.create({
  baseURL: '/api',
  timeout: 5000
})

http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 请求头携带token
    const token = getToken()
    if (token) {
      config.headers!.authorization = `${token}`
    }
    return config
  },
  (err: Error) => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  (config: AxiosResponse) => {
    if (config.data.status === 400) {
      ElMessage.error(`出错了：${config.data.message}`)
    }

    return config.data
  },
  (err: Error) => {
    return Promise.reject(err)
  }
)

export default http
