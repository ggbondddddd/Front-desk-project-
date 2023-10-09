import Vue from 'vue'
import App from './App.vue'


//注册全局组件----- 三级联动组件
import TypeNav from '@/components/TypeNav'
// 引入组件 然后在下面注册
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
// 引入elementUI的组件
import { Button, MessageBox } from 'element-ui'  //此处还有一种引入方式 Vue.use(Button) 不管这种方式只能一个一个引入很麻烦
//下面 第一个参数是全局组件名TypeNav.name 通过引入的TypeNav获取这个组件名
//  第二个参数：具体的那一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
// 注册全局组件elementUi，这是第一种写法
Vue.component(Button.name, Button)
// elementUI注册组件的时候，这是第二种写法，挂在原型上 
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
// 引入路由
import router from '@/router'
// 引入仓库
import store from '@/store'
// 引入MockServer.js   mock数据
import '@/mock/mockServe'
// 引入swiper样式 在入口文件 所以基本相当于是全局样式了
import 'swiper/css/swiper.css'

Vue.config.productionTip = false

// 统一接口api文件夹里面全部请求函数 这个API是包含所有请求函数的对象 把这个对象放在vue原型对象身上
import * as API from '@/api'
import ggb from '@/assets/ggb.jpg'
// 引入图片懒加载插件
import VueLayload from 'vue-lazyload'
// 注册插件
Vue.use(VueLayload, {
  // 懒加载默认的图片 这里不知道为什么 不能直接写链接
  // 我理解的这个参数传递去然后就可以在生命周期钩子上在自己传入的图片未加载出来之前把这个图片展示 
  loading: ggb
})

// 引入表单校验插件  就是正则那种 所有引入以及功能实现都plugins/validate里面实现了
import '@/plugins/validate'

// 引入自定义插件
import myPlugins from '@/plugins/myPlugins'
// 这里其实本质上就相当于给myPlugin.install方法里面传参数
Vue.use(myPlugins, {
  name: 'upper'
})

new Vue({
  render: h => h(App),
  // 全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API

  },
  // 注册组件，router:router ，组件实例会拥有一个$route，$router属性
  router,
  // 注册仓库:组件实例的身上会多一个$store属性
  store,

}).$mount('#app')
