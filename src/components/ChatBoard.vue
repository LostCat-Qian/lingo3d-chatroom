<template>
  <div class="chat-board w-96 h-64 fixed bottom-0 z-50">
    <!-- 系统通知消息 -->
    <div class="system-info fixed">
      <el-tag size="large" type="warning">系统消息</el-tag>
      <span class="info ml-2" style="color: red">
        欢迎用户 <span style="color: white">{{ onlineUserList[onlineUserList.length - 1] }}</span> 来到聊天室!
      </span>
    </div>

    <div class="comments mt-9">
      <!-- 用户消息 -->
      <div class="message" v-for="(item, index) in commentsList" :key="index">
        <el-tag size="large" type="success">{{ item.username }}</el-tag>
        <span class="info ml-2">{{ item.content }}</span>
      </div>
    </div>

    <!-- 聊天板主体 -->
    <div class="chat-container">
      <el-input v-model="chatInfo" @keydown.enter="sendMessage" maxlength="19" placeholder="Input Chat Message..." />
      <el-button @click="sendMessage" type="primary">发送消息</el-button>
    </div>
  </div>

  <div class="current-people">
    <h4>当前在线人数：{{ onlineUsers }}</h4>
    <hr />
    <div v-for="user in onlineUserList" class="nickname">用户: {{ user }} 在线</div>
  </div>

  <div class="announcement-box">
    <div class="content">
      <div class="title">
        <span>{{ announcement?.title || '--' }}</span>
        <span>
          {{ announcement?.date?.toString()?.slice(0, 19)?.split('T')[0] }}
          {{ announcement?.date?.toString()?.slice(0, 19)?.split('T')[1] }}
        </span>
      </div>
      <hr />
      <div class="info">{{ announcement?.content || '--' }}</div>
    </div>
    <div class="tip-button">最新公告</div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, Ref, ref, watch } from 'vue'
import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router'
import useSocket from '../hooks/useSocket'
import { useStore } from 'vuex'
import { fetchAnnouncements } from '../api'

interface userChatInfo {
  userId: number
  username: string
  content: string
}

// 定义聊天板输入框数据
const chatInfo: Ref<string> = ref('')
// 定义在线人数
const onlineUserList: Ref<string[]> = ref([])
const onlineUsers: Ref<number> = ref(0)
// 定义目前聊天板内容
const commentsList: Ref<Array<userChatInfo>> = ref([])
// 定义公告信息
const announcement: Ref<any> = ref({})
// 使用路由参数
const route: RouteLocationNormalizedLoaded = useRoute()
const { username } = route.query
// 使用 vuex
const store = useStore()
// 使用 socket
const socket = useSocket()

onMounted(() => {
  // 持续获取公告信息
  getAnnouncementList()
  setInterval(() => {
    getAnnouncementList()
  }, 10000)

  // 触发获取用户广播的消息的事件
  socket.on('sendServerMsg', (data: any) => {
    // 如果消息是从当前房间的用户发出的，就进行广播
    if (data.roomName === store.getters.getRoomName) {
      commentsList.value.push(data)
      // 使用 scrollIntoView 方法自动将滚动条滑倒最后一条消息的所在位置
      const length: number = commentsList.value.length
      // DOM 更新后再触发滚动
      nextTick(() => {
        const newMsg = document.getElementsByClassName('message')[length - 1]
        newMsg.scrollIntoView()
      })
    } else {
      return
    }
  })

  // 使用多值侦听,侦听用户数量和用户列表
  // TODO
  console.log(store.getters.getUserList)
  watch(
    [() => store.state.userCount, () => store.state.userList],
    ([newOnlineUsers, newUserList]) => {
      onlineUsers.value = newOnlineUsers
      onlineUserList.value = newUserList
    },
    {
      deep: true,
      immediate: true
    }
  )
})

// 获取公告列表
const getAnnouncementList = async () => {
  const data = await fetchAnnouncements()
  announcement.value = data.at(-1)
}

// 发送消息
const sendMessage = () => {
  if (chatInfo.value === '' || chatInfo.value.trim() === '') {
    chatInfo.value = ''
    return
  }

  socket.emit('sendMessage', {
    userId: 1,
    roomName: store.getters.getRoomName,
    username: username,
    content: chatInfo.value
  })
  chatInfo.value = ''
}
</script>

<style lang="scss" scoped>
// 滚动条样式
::-webkit-scrollbar {
  width: 5px;
  background-color: #ffffff75;
}

// 滚动条上的滚动滑块
::-webkit-scrollbar-thumb {
  background-color: #409eff;
  border-radius: 5px;
}

.chat-board {
  width: 400px;
  height: 260px;
  border-radius: 10px;
  background-color: #00000075;
  color: white;

  position: fixed;
  overflow: auto;
  z-index: 999;
  bottom: 0;

  .comments {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 30px;

    .message {
      width: 100%;
      height: 35px;
    }

    .info {
      line-height: 30px;
    }
  }

  .chat-container {
    width: 400px;
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
  }
}

.current-people {
  position: fixed;
  right: 0;
  background-color: #00000075;
  color: #fff;

  z-index: 999;
  min-height: 25px;
}

.announcement-box {
  position: fixed;
  left: -370px;
  top: 5%;
  width: 400px;
  height: 300px;
  background-color: #00000075;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  transition: all 0.3s;
  border-radius: 0 10px 10px 0;

  &::after {
    width: 100px;
    height: 50px;
    background-color: #000;
    position: absolute;
    right: 0;
  }

  &:hover {
    left: 0;
  }

  .content {
    width: 370px;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info {
      margin-top: 10px;
    }
  }

  .tip-button {
    width: 30px;
    height: 100%;
    text-align: center;
  }
}
</style>
