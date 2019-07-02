// 自己封装的一个axios 插件
// 导入Vue 实例作为参数
import Vue from 'vue'
// 导入 axios
import axios from 'axios'
// 创建插件对象
let myaxios = {};
// 添加 install 方法
myaxios.install = function (Vue) {
    // 统一设置请求的 API 
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    // 设置一个请求拦截器
    axios.interceptors.request.use(config=>{
        // 这里是一个回调函数，这个函数会在请求发送之前执行，这时，这个axios已经将所有参数都放到了config中
        if(config.url != 'login') {
            // 统一设置 token
            // 应该将 token 添加到 config 中
            config.headers.common['Authorization'] = localStorage.getItem('token')
        }
        return config
    })
    // 给 Vue实例对象添加方法
    Vue.prototype.$http = axios
}

//将对象暴露出去
export default myaxios