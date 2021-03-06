import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Home from './components/Home.vue'
import Welcome from './components/welcome.vue'
import Rights from './components/power/rights.vue'
import Roles from './components/power/Roles.vue'
import Goods from './components/goods/goods_cate.vue'

// 用户列表组件
import User from './components/user/user.vue'
Vue.use(Router)

const routes = [{
  path: '',
  redirect: "/login"
}, {
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: "./welcome",
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: User
  },
  {
    path: '/rights',
    component: Rights
  },
  {
    path: '/rights',
    component: Rights
  }, {
    path: '/roles',
    component: Roles
  }, {
    path: '/goods',
    component: Goods
  }]
}]

const router = new Router({
  routes,
  mode: 'history'

})
//为路由对象添加 beforeEach导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokernstr = window.sessionStorage.getItem("token");
  if (!tokernstr) return next('/login')
  next()
})
export default router
