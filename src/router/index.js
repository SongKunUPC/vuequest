import Vue from 'vue'
import VueRouter from 'vue-router'
import ro from "element-ui/src/locale/lang/ro";

// 懒加载，统一管理
const Home = () => import('../components/Home')
const Login = () => import('../components/Login')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path:'/login',
    component: Login
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

// 挂载全局路由导航守卫
router.beforeEach((to,from,next)=>{
  // to: 将要访问的路径
  // form: 从哪个路径跳转而来
  // next: 是一个函数，表示放行
  // 有两种方式： next() 放行，next('/login') 强制跳转的路径
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('Authorization');
  if(!tokenStr) return next('/login')
  next()
})

export default router
