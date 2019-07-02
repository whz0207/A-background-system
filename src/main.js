// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入 element-ui
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
// 引入 element-tree-grid
import TreeGrid from 'element-tree-grid'
// 引入自己封装的myaxios插件
import myaxios from './assets/js/myaxios.js'
// 引入mymoment
import mymoment from './assets/js/mymoment.js'
// 引入 富文本编辑框
import VueQuillEditor from 'vue-quill-editor'

// 调用方法myaxios
Vue.use(myaxios)
Vue.use(mymoment)

// 定义一个全局组件 tree-grid
Vue.component(TreeGrid.name,TreeGrid)

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// Vue并不支持全局注册方法，更支持以插件的方式使用
// import axios from 'axios'

// // 设置统一的请求路径
// // axios.defaults.baseURL = ''
// // 设置给 VUE 实例对象
// Vue.prototype.$http = axios

// 导入 全局样式
import './assets/css/index.css'

//使用ElementUI
Vue.use(ElementUI)
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>' // 将App渲染到视图容器中
})





