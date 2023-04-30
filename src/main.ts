import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'animate.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import store from './store/index'
import router from './router/index'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(store)

app.mount('#app')
