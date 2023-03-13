<template>
  <h1>填入id、选择模型界面，验证id后跳转加载页面，加载完毕再跳转到world页面</h1>
  <div class="enter-container">
    <el-input v-model="username" placeholder="请输入您的ID..."></el-input>
    <el-button type="success" @click="enterWorldPage">点击进入</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { Router, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useSocket from '../hooks/useSocket'

import { useStore } from 'vuex'

// 用户输入的 ID
const username: Ref<string> = ref('')
// 路由
const router: Router = useRouter()
// socket.io 实例
const socket = useSocket()
const store = useStore()

const enterWorldPage = () => {
  if (username.value === '' || username.value.trim() === '') {
    ElMessage({
      message: '用户名不能为空！',
      type: 'error'
    })
    return
  }

  socket.emit('enter', username.value)

  socket.on('userExist', (data) => {
    console.log(data)
    ElMessage({
      message: data.msg,
      type: 'error'
    })
    return
  })

  socket.on('userEnter', (user) => {
    router.push({
      path: '/world',
      query: {
        username: username.value
      }
    })

    socket.on('userCount', (count) => {
      store.commit('setUserCount', count)
    })

    socket.on('userList', (list) => {
      console.log(list)
      store.commit('setUserList', list)
    })

    store.commit('addUser', user)
  })
}
</script>

<style lang="scss" scoped>
// @function flex(@justify: center, @align, @direction) {
//   display: flex;
//   justify-content: @justify;
// }

.enter-container {
  width: 600px;
  height: 400px;
}
</style>
