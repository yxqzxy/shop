import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Home from './components/Home.vue'


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
  component: Home
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
