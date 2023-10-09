// 这个文件夹就是创建axios实例 

// 对axios进行二次封装
import axios from "axios"
// 引入进度条
import nprogress from "nprogress"
// 光引入进度条没用 显示不出进度条 还要引入进度条样式
import "nprogress/nprogress.css"
// nprogress对象里面的strat方法：进度条开始 done方法：代表进度条结束


// 1 利用axios对象的方法creat，去创建一个axios实例
// 2 这个requests就是axios，只不过改了一些配置
const requests = axios.create({
    // 配置对象
    // 基础路径，发请求的时候，路径当中自动在比如8080后面添加/api
    baseURL: "/mock",
    // 代表请求超时的时间5s
    timeout: 5000,
})
// 请求拦截器：在请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
    // comfig:配置对象，对象里面有一个属性很重要，headers请求头
    // 进度条开始动
    nprogress.start()
    return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
    // 成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情
    // 进度条结束
    nprogress.done()
    return res.data

}, (error) => {
    // 服务器响应失败的回调函数
    return Promise.reject(new Error('fail'))
})

// 对外暴露
export default requests