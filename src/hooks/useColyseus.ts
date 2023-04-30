import { Client } from 'colyseus.js'
import { createProxy } from 'lingo3d-vue'
import { Dummy, loop } from 'lingo3d'
import { reactive, Ref, watchEffect } from 'vue'
import { ColyseusURL } from '../utils/URL'
import { useStore } from 'vuex'

// const ColyseusURL = 'ws://localhost:2567'

export default (dummyRef: Ref<Dummy | undefined>) => {
  const client = new Client(ColyseusURL)
  const dummyProxies = reactive<Record<string, Dummy>>({})
  const store = useStore()

  watchEffect(async (cleanup) => {
    const dummy = dummyRef.value
    if (!dummy) return

    const room = await client.joinOrCreate<any>('my_room')

    room.state.players.onAdd = (player: any, sessionId: string) => {
      console.log('player joined', sessionId)

      const isMe = room.sessionId === sessionId
      if (isMe) {
        // 提交用户自身sessionId到vuex
        store.commit('setUserSessionId', sessionId)
        // console.log('My sessionId: ', sessionId)
        return
      }

      const dummyProxy = (dummyProxies[sessionId] = createProxy<Dummy>())

      player.onChange = () => {
        Object.assign(dummyProxy, player)
      }
    }

    room.state.players.onRemove = (_: any, sessionId: string) => {
      console.log('player left', sessionId)

      delete dummyProxies[sessionId]
    }

    const handle = loop(() => {
      const { x, y, z, rotationX, rotationY, rotationZ, animation, src } = dummy
      room.send('updatePlayer', { x, y, z, rotationX, rotationY, rotationZ, animation, src })
    })

    cleanup(() => {
      handle.cancel()
      room.leave()
    })
  })

  return dummyProxies
}
