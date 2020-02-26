import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载，统一管理
const Home = () => import('../views/Home')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

export default router
