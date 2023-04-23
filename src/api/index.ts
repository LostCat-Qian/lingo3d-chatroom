import http from '../utils/http'

type User = {
  nickname?: string
  username: string
  password: string
}

// 用户登录
const userLogin = async (params: User) => {
  const { data } = await http.post('/user/login', {
    ...params
  })
  return data
}

// 用户注册
const userRegist = async (params: User) => {
  const { data } = await http.post('/user/regist', {
    ...params
  })
  return data
}

const fetchAnnouncements = async () => {
  const { data } = await http.get('/announcement/getAnnouncements')
  return data
}

export { userLogin, userRegist, fetchAnnouncements }
