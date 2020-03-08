import Vue from 'vue'
import VueRouter from 'vue-router'
import ro from "element-ui/src/locale/lang/ro";

// 懒加载，统一管理
const Home = () => import('../components/Home')
const Login = () => import('../components/Login')
const Welcome = () => import('../components/Welcome')
const School = () => import('../components/School/School')
const User = () => import('../components/User/User')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: '/school/list',
        component: School
      },
      {
        path: '/user/list',
        component: User
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 挂载全局路由导航守卫
router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // form: 从哪个路径跳转而来
  // next: 是一个函数，表示放行
  // 有两种方式： next() 放行，next('/login') 强制跳转的路径
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login')
  next()
})

export default router
