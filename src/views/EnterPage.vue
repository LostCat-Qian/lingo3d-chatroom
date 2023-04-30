<template>
  <!-- <h1>填入id、选择模型界面，验证id后跳转加载页面，加载完毕再跳转到world页面</h1>
  <div class="enter-container">
    <el-input v-model="username" placeholder="请输入您的ID..."></el-input>
    <el-button type="success" @click="enterWorldPage">点击进入</el-button>
  </div> -->

  <div class="container">
    <div class="inner animate__animated animate__bounceInLeft animate__fast">
      <div class="left-title">
        <div class="title-inner">
          <div class="title">Lingo3D</div>
          <div class="title">ChatRoom</div>
          <div class="welcome">Welcome To ChatRoom!</div>
        </div>
      </div>
      <div class="line"></div>
      <div class="right-form">
        <div class="form-inner">
          <div class="title">登录</div>
          <div class="form">
            <ul>
              <li>
                <label for="userinput">账号:</label>
                <input
                  v-model.trim="username"
                  placeholder="请输入您的账号..."
                  @keydown.enter="enterWorldPage"
                  id="userinput"
                  type="text"
                />
              </li>
              <li>
                <label for="pwdinput">密码:</label>
                <input
                  v-model.trim="password"
                  placeholder="请输入您的密码..."
                  @keydown.enter="enterWorldPage"
                  id="pwdinput"
                  type="password"
                />
              </li>
              <li>
                <label for="pwdinput">选择模型:</label>
                <select name="" id="" v-model="modelSrc">
                  <option value="">请选择</option>
                  <option value="NinjaModel/ninja.fbx">忍者</option>
                  <option value="KannaModel/untitled.fbx">康纳</option>
                  <option value="YusakiModel/untitled.fbx">宇崎</option>
                </select>
              </li>
              <li>
                <button id="login" @click="login">确定</button>
                <button id="regist" @click="enterRegistPage">注册</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 水印遮罩层 -->
  <div class="bodymask">
    <div v-for="item in 80" :key="item" style="line-height: 10px">
      <p>作者：冉千</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from 'vue'
import { Router, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useSocket from '../hooks/useSocket'
import { useStore } from 'vuex'
import { userLogin, fetchCurrentMap } from '../api'
import { setToken } from '../utils/token'

// 用户输入的 ID
const username: Ref<string> = ref('')
// 用户输入的密码
const password: Ref<string> = ref('')
// 用户选择的模型路径
const modelSrc: Ref<string> = ref('NinjaModel/ninja.fbx')

// 路由
const router: Router = useRouter()
// socket.io 实例
const socket = useSocket()
// vuex store
const store = useStore()

// 确定按钮回调
const login = async () => {
  if (username.value === '' || password.value === '') {
    return ElMessage({
      message: '账号或密码不能为空！',
      type: 'error'
    })
  }

  try {
    const data = await userLogin({
      username: username.value,
      password: password.value
    })

    window.localStorage.setItem('userToken', data?.token)
    window.localStorage.setItem('nickname', data?.nickname)
    setToken(data?.token)
    enterWorldPage()
  } catch (err: any) {
    ElMessage.error('登录失败！请检查您的账号或密码')
  }
}

// 获取当前已激活的聊天地图场景
const getCurrentMap = async () => {
  const data = await fetchCurrentMap()
  store.commit('setCurrentMap', data)
}

// 跳转到注册页面
const enterRegistPage = () => {
  router.push('/regist')
}

onMounted(() => {
  getCurrentMap()
})

// 跳转到聊天室，socket 事件监听
const enterWorldPage = () => {
  socket.emit('enter', window.localStorage.getItem('nickname'))

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
        // 传递用户名
        username: window.localStorage.getItem('nickname'),
        // 传递用户所选择的模型路径
        src: modelSrc.value
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
@mixin flex($justify: center, $align: center, $direction: row) {
  display: flex;
  justify-content: $justify;
  align-items: $align;
  flex-direction: $direction;
}

$main-color: #1f2124;
$secondary-color: #383a3f;
$decorative-color: #f68657;
$secondary-decorative-color: #f6b352;

.container {
  width: 100vw;
  height: 100vh;
  user-select: none;
  background-color: $main-color;
  @include flex();

  .inner {
    width: 855px;
    height: 550px;
    border-radius: 10px;
    background-color: $secondary-color;
    font-family: 'Courier New', Courier, monospace;
    @include flex(space-between, center, row);

    .left-title,
    .right-form {
      width: 50%;
      height: 100%;
    }

    .line {
      width: 5px;
      height: 90%;
      border-radius: 35%;
      background-color: $secondary-decorative-color;
    }

    // 左侧标题样式
    .left-title {
      @include flex();
      transition: all 0.3s;

      &:hover {
        transform: scale(105%);
      }

      .title-inner {
        height: 55%;
        @include flex(space-around, center, column);

        .title {
          color: $decorative-color;
          font-size: 80px;
          font-weight: bold;
        }

        .welcome {
          font-size: 18px;
          color: $secondary-decorative-color;
        }
      }
    }

    // 右侧登录表单样式
    .right-form {
      padding: 80px 40px;

      .form-inner {
        .title {
          font-size: 35px;
          font-weight: bold;
          color: $decorative-color;
          text-align: center;
        }

        .form {
          li {
            margin-top: 30px;

            label {
              color: $decorative-color;
            }

            #userinput,
            #pwdinput,
            select {
              width: 100%;
              height: 40px;
              border-radius: 5px;
              padding: 0 16px;
              transition: all 0.2s;
              background-color: $main-color;
              color: $decorative-color;

              &:focus {
                outline: 3px solid $decorative-color;
              }
            }

            &:last-child {
              width: 80%;
              margin: 40px auto;
              @include flex(space-around, center, row);

              #login,
              #regist {
                border: 3px solid $decorative-color;
                padding: 7px 22px;
                font-weight: bold;
                background-color: $decorative-color;
                border-radius: 5px;
                color: $secondary-color;
                transition: all 0.2s;

                &:hover {
                  transform: scale(108%);
                }

                &:active {
                  transform: scale(90%);
                }
              }
            }
          }
        }
      }
    }
  }
}

// 水印遮罩层样式
.bodymask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.2;
  // 点击穿透事件
  pointer-events: none;
  display: flex;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.4);
  z-index: 99999999;

  div {
    margin: 50px;
    transform: rotate(30deg);
    font-size: 16px;
    font-family: 'Courier New', Courier, monospace;
    margin-bottom: 0;
  }
}
</style>
