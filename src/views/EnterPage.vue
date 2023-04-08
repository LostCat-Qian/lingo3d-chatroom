<template>
  <!-- <h1>填入id、选择模型界面，验证id后跳转加载页面，加载完毕再跳转到world页面</h1>
  <div class="enter-container">
    <el-input v-model="username" placeholder="请输入您的ID..."></el-input>
    <el-button type="success" @click="enterWorldPage">点击进入</el-button>
  </div> -->

  <div class="container">
    <div class="inner animate__animated animate__bounceInDown animate__fast">
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
          <div class="title">登入</div>
          <div class="form">
            <ul>
              <li>
                <label for="userinput">用户ID:</label>
                <input
                  v-model.trim="username"
                  placeholder="请输入您的ID..."
                  @keydown.enter="enterWorldPage"
                  id="userinput"
                  type="text"
                />
              </li>
              <li>
                <label for="pwdinput">登入密码:</label>
                <input
                  v-model.trim="password"
                  placeholder="请输入您的密码..."
                  @keydown.enter="enterWorldPage"
                  id="pwdinput"
                  type="password"
                />
              </li>
              <li>
                <button id="login" @click="enterWorldPage">确定</button>
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
      <p>作者：趴姿菜狗</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { Router, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useSocket from '../hooks/useSocket'
import { useStore } from 'vuex'

// 用户输入的 ID
const username: Ref<string> = ref('')
// 用户输入的密码
const password: Ref<string> = ref('')

// 路由
const router: Router = useRouter()
// socket.io 实例
const socket = useSocket()
// vuex store
const store = useStore()

// 跳转到聊天室，socket 事件监听
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
            margin-top: 40px;

            label {
              color: $decorative-color;
            }

            #userinput,
            #pwdinput {
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
              width: 100%;
              @include flex();

              #login {
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
  opacity: 0.1;
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
