import { createStore } from 'vuex'

const store = createStore({
  state: {
    token: '',
    userCount: 0,
    userList: [] as string[],
    userSessionId: '',
    currentMap: {}
  },
  getters: {
    // 返回当前所有用户列表
    getUserList(state) {
      return state.userList
    },
    // 返回当前用户自身的 sessionId
    getSessionId(state) {
      return state.userSessionId
    },
    // 返回当前的地图信息
    getCurrentMap(state) {
      return state.currentMap
    }
  },
  mutations: {
    // 设置用户的sessionId
    setUserSessionId(state, sessionId: string) {
      state.userSessionId = sessionId
    },
    // 设置当前的地图信息
    setCurrentMap(state, info) {
      state.currentMap = info
    },
    addUser(state, username: string) {
      state.userList.push(username)
    },
    setUserList(state, userList) {
      state.userList = userList
    },
    addNewUserToList(state, newUser) {
      state.userList.push(newUser)
    },
    setUserCount(state, count) {
      state.userCount = count
    }
  },
  actions: {}
})

export default store
