<template>
  <chat-board></chat-board>

  <World>
    <Model :metalness-factor="2" :roughness-factor="0.2" :scale="200" src="map.glb" physics="map" />
    <Dummy
      v-for="(dummyProxy, sessionId) in dummyProxies"
      :key="sessionId"
      :animations="NinjaAnimations"
      :proxy="dummyProxy"
      preset="idle"
    />

    <ThirdPersonCamera mouse-control active :inner-x="30" :inner-y="50">
      <Dummy
        src="NinjaModel/ninja.fbx"
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
  </World>
</template>

<script lang="ts" setup>
import { World, Model, ThirdPersonCamera, Dummy, Setup, Reticle } from 'lingo3d-vue'
import { Dummy as dummy } from 'lingo3d'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, Router } from 'vue-router'
import { ElMessage } from 'element-plus'

import useColyseus from '../hooks/useColyseus'
import useKeyboard from '../hooks/useKeyboard'
import ChatBoard from '../components/ChatBoard.vue'

const route = useRoute()
const router: Router = useRouter()

onMounted(() => {
  // 简单判断处理，防止用户通过 url 直接进入聊天室
  if (!route.query.username) {
    ElMessage.error('您没有权限，请检查是否正确登录!')

    router.replace({
      path: '/enter'
    })
  }
})

const dummyRef = ref<dummy | undefined>()
// 定义当前播放动画，默认为 idle 站立
const animation = ref('idle')

// 定义忍者模型的所有动画
const NinjaAnimations = {
  idle: 'NinjaModel/idle.fbx',
  walking: 'NinjaModel/Walking.fbx',
  jump: 'NinjaModel/Jump.fbx'
}

const dummyProxies = useColyseus(dummyRef)

useKeyboard(dummyRef, animation)
</script>

<style lang="scss" scoped></style>
