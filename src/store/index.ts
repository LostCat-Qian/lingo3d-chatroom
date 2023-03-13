import { createStore } from 'vuex'

const store = createStore({
  state: {
    token: '',
    userCount: 0,
    userList: [] as string[]
  },
  getters: {
    getUserList(state) {
      return state.userList
    }
  },
  mutations: {
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
