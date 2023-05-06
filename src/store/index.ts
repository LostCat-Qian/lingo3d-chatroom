import { createStore } from 'vuex'

const store = createStore({
  state: {
    // jwt
    token: '',
    userCount: 0,
    userList: [] as string[],
    // 用户的sessionId
    userSessionId: '',
    // 当前的地图
    currentMap: {},
    // 用户要进入的房间名
    roomName: ''
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
    },
    // 返回当前用户要进入的房间
    getRoomName(state) {
      return state.roomName
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
    // 设置用户想要进入的房间
    setRoomName(state, roomName) {
      if (roomName) {
        state.roomName = roomName
      } else {
        // 默认大厅的房间名为 my_room
        state.roomName = 'my_room'
      }
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
