<template>
  <chat-board></chat-board>
  <Keyboard @key-up="handleKeyUp" @key-down="handleKeyDown" />
  <World>
    <!-- <Model :metalness-factor="2" :roughness-factor="0.2" :scale="200" src="lab.glb" physics="map" /> -->
    <!-- <Model :metalness-factor="0" :roughness-factor="1" :scale="40" src="desert.glb" physics="map" /> -->
    <Model
      :metalness-factor="currentMap.metalness"
      :roughness-factor="currentMap.roughness"
      :scale="currentMap.scale"
      :src="currentMap.src"
      physics="map"
    />
    <Dummy
      v-for="(dummyProxy, sessionId) in dummyProxies"
      :key="sessionId"
      :animations="NinjaAnimations"
      :proxy="dummyProxy"
      preset="idle"
    />

    <ThirdPersonCamera mouse-control active :inner-x="30" :inner-y="50">
      <Dummy
        :src="modelSrc"
        :x="1179.8"
        :y="-575.03"
        :z="1820.55"
        preset="rifle"
        ref="dummyRef"
        :animations="NinjaAnimations"
        :animation="animation"
        stride-move
        physics="character"
      >
      </Dummy>
    </ThirdPersonCamera>
    <Reticle />
    <Setup default-light="studio" :exposure="2" />
    <Skybox texture="skybox.jpg" />
  </World>
</template>

<script lang="ts" setup>
import { World, Model, ThirdPersonCamera, Dummy, Setup, Reticle, Keyboard, Skybox } from 'lingo3d-vue'
import { Dummy as dummy } from 'lingo3d'
import { Ref, onMounted, ref } from 'vue'
import { useRoute, useRouter, Router } from 'vue-router'
import { ElMessage } from 'element-plus'

import useColyseus from '../hooks/useColyseus'
import useKeyboard from '../hooks/useKeyboard'
import ChatBoard from '../components/ChatBoard.vue'
import { Store, useStore } from 'vuex'
import useSocket from '../hooks/useSocket'
import { recStart, recStop } from '../utils/recorder'

const route = useRoute()
const router: Router = useRouter()
const store = useStore()
const socket = useSocket()
const modelSrc: Ref<string> = ref('NinjaModel/ninja.fbx')
const currentMap: Ref<any> = ref({})

onMounted(() => {
  // 简单判断处理，防止用户通过 url 直接进入聊天室
  if (!route.query.username) {
    ElMessage.error('您没有权限，请检查是否正确登录!')

    router.replace({
      path: '/enter'
    })
  } else {
    ElMessage.success('登录成功！欢迎回来')
  }

  // 接收用户所选择的模型
  modelSrc.value = route.query.src as string
  // 接收地图信息
  currentMap.value = store.getters.getCurrentMap
})

const dummyRef = ref<dummy | undefined>()
// 定义当前播放动画，默认为 idle 站立
const animation = ref('idle')

// 定义忍者模型的所有动画
const NinjaAnimations = {
  idle: 'NinjaModel/idle.fbx',
  walking: 'NinjaModel/Walking.fbx',
  jump: 'NinjaModel/Jump.fbx',
  running: 'NinjaModel/Running.fbx'
}

const dummyProxies = useColyseus(dummyRef)

// 语音播报
socket.on('audio', ({ id, blob: buffer, roomName }) => {
  // 当发出语音的是自己时，并且只有自己所在的房间内，才进行语音播报
  if (id !== store.getters.getSessionId && roomName === store.getters.getRoomName) {
    const blob = new Blob([buffer], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    console.log(url)
    let audio: HTMLAudioElement | null = new Audio(url)
    audio.play()
    audio.addEventListener(
      'ended',
      () => {
        URL.revokeObjectURL(url)
        audio = null
      },
      false
    )
  }
})

// 按下V键开始录音，再次按V键停止录音
const isStartRecord = ref(false)
const handleKeyDown = (key: string) => {
  if (key === 'v') {
    if (isStartRecord.value === false) {
      isStartRecord.value = true
      recStart()
    } else {
      isStartRecord.value = false
      recStop()
    }
  }
}

const handleKeyUp = (key: string) => {
  // if (key == 'v') {
  //   recStop()
  // }
}

useKeyboard(dummyRef, animation)
</script>

<style lang="scss" scoped></style>
