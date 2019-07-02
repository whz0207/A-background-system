import Vue from 'vue'
import Router from 'vue-router'
// 引入 userElement组件
import UserElement from '../components/userElement.vue'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '../components/users/users.vue'
import Right from '../components/right/rights.vue'
import Role from '../components/role/roles.vue'
import Categories from '../components/categories/categories.vue'
import Goods from '../components/goods/goods.vue'
import goodsAdd from '../components/goodsadd/goodsadd.vue'
import Reports from '../components/reports/reports.vue'

// 引入message
import { Message } from 'element-ui'

Vue.use(Router)

let router = new Router({ // 路有对象
  routes: [ // 路由选项
    // { path: '/', redirect: '/home' }, // redirect:重定向 ，当用户请求根目录时默认处在主页home
    { path: '/', redirect: { name: 'home' } }, // 重定向的另一种方式
    { path: '/userelement', component: UserElement }, // 使用 element-ui的路由
    { path: '/login', name: 'login', component: Login }, // 登陆的路由
    // 给home添加子路由
    {
      path: '/home', name: 'home', component: Home,
      children: [
        { path: '/users', name: 'users', component: Users }, // 添加一个home的子路由users
        { path: '/rights', name: 'rights', component: Right }, // 添加一个home的子路由right
        { path: '/roles', name: 'roles', component: Role }, // 添加一个home的子路由role
        { path: '/categories', name: 'categories', component: Categories }, // 添加一个home的子路由categories
        { path: '/goods', name: 'goods', component: Goods }, // 添加一个Home的子路由 goods
        { path: '/goods/add', name: 'goodsadd', component: goodsAdd }, //添加一个home 的子路由add
        { path: '/reports', name: 'reports', component: Reports }, //添加一个home 的子路由reports
      ]
    } // 主页的路由
  ]
})

// 添加一个路由守卫
router.beforeEach((to, from, next) => {
  // 完成登录逻辑
  // 只要请求的不是login 就需要进行登录验证
  if (to.path != '/login') {
    // 判断是否存在token
    if (!window.localStorage.getItem('token')) {
      Message({
        type: 'error',
        message: '您还没有登录'
      })
      router.push('/login')
      return
    }
  }
  next()
})

export default router