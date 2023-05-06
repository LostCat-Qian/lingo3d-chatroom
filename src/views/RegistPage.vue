<template>
  <div class="container">
    <div class="inner animate__animated animate__bounceInRight animate__fast">
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
          <div class="title">注册</div>
          <div class="form">
            <ul>
              <li>
                <label for="userinput">昵称:</label>
                <input
                  v-model.trim="nickname"
                  placeholder="请输入您的昵称..."
                  @keydown.enter="regist"
                  id="nickinput"
                  type="text"
                />
              </li>
              <li>
                <label for="userinput">账号:</label>
                <input
                  v-model.trim="username"
                  placeholder="请输入您的账号..."
                  @keydown.enter="regist"
                  id="userinput"
                  type="text"
                />
              </li>
              <li>
                <label for="pwdinput">登入密码:</label>
                <input
                  v-model.trim="password"
                  placeholder="请输入您的密码..."
                  @keydown.enter="regist"
                  id="pwdinput"
                  type="password"
                />
              </li>
              <li>
                <button id="login" @click="regist">确定</button>
                <button id="login" @click="gotoEnterPage">去登录</button>
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
import { userRegist } from '../api'

// 用户输入的昵称
const nickname: Ref<string> = ref('')
// 用户输入的账号
const username: Ref<string> = ref('')
// 用户输入的密码
const password: Ref<string> = ref('')

// 路由
const router: Router = useRouter()

// vuex store
const store = useStore()

// 去登录
const gotoEnterPage = () => {
  router.push('/enter')
}

// 确定按钮的回调
const regist = async () => {
  if (nickname.value === '' || username.value === '' || password.value === '') {
    return ElMessage.error('昵称、账号或密码不能为空!')
  }

  try {
    const data = await userRegist({
      nickname: nickname.value,
      username: username.value,
      password: password.value
    })
    console.log(data)
    ElMessage.success('注册成功！您可以点击去登录按钮立即登录')
  } catch (err: any) {
    ElMessage.error('注册失败！昵称或账号已存在')
  }
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
  width: 100%;
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
            margin-top: 25px;

            label {
              color: $decorative-color;
            }

            #nickinput,
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
              margin: 25px auto;
              @include flex(space-around, center, row);

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
