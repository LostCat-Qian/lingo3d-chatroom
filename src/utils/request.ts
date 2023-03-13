import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config
  },
  (err: Error) => {}
)

instance.interceptors.response.use(
  (config: AxiosResponse) => {
    return config
  },
  (err: Error) => {}
)

export default instance
