import {
  createRouter,
  createWebHistory
} from "vue-router"
import Home from '../pages/MainView.vue'

const routes = [{
  path: '/wap',
  component: Home
}, ]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router