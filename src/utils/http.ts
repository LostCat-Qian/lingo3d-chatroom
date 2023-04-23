import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: '/api',
  timeout: 5000
})

http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
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
