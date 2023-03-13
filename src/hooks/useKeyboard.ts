import { Dummy as dummy } from 'lingo3d'
import { keyboard } from 'lingo3d-vue'
import { Ref } from 'vue'

const useKeyboard = (dummyRef: Ref<dummy | undefined>, animation: Ref<string>) => {
  // 定义纵向方法
  const lineMove = (dummy: dummy, v: number, action: string) => {
    dummy.strideForward = v
    animation.value = action
  }

  // 定义横向移动方法
  const rightMove = (dummy: dummy, v: number, action: string) => {
    dummy.strideRight = v
    animation.value = action
  }

  // 定义按键操作
  keyboard.onKeyPress = (_, pressed) => {
    const dummy = dummyRef.value
    if (!dummy) return

    if (pressed.has('w')) {
      lineMove(dummy, -10, 'walking')
    }
    if (pressed.has('s')) {
      lineMove(dummy, 10, 'walking')
    }

    if (pressed.has('a')) {
      rightMove(dummy, 10, 'walking')
    }
    if (pressed.has('d')) {
      rightMove(dummy, -10, 'walking')
    }
  }

  keyboard.onKeyDown = (key) => {
    const dummy = dummyRef.value
    if (!dummy) return

    if (key === 'Space') {
      dummy.jump(10)
      animation.value = 'jump'
    }
  }

  keyboard.onKeyUp = (_, pressed) => {
    const dummy = dummyRef.value
    if (!dummy) return

    if (!pressed.has('w') && !pressed.has('s')) {
      lineMove(dummy, 0, 'idle')
    }

    if (!pressed.has('a') && !pressed.has('d')) {
      rightMove(dummy, 0, 'idle')
    }
  }
}

export default useKeyboard
