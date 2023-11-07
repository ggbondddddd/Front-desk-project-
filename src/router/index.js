// 配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes.js'
// 使用插件
Vue.use(VueRouter)
// 引入store
import store from '@/store'

// 从写vueRouter原型对象的push，先保存一份 然后二次封装，也就是给push一个新函数
let orginPush = VueRouter.prototype.push //orginPush这个变量是全局挂载在window上 想要在vueRouter里面拿到就必须用call方法让其this指向是vueRouter
let orainReplace = VueRouter.prototype.replace

// 重写push|replace
// 由于 vue-router3.0 及以上版本回调形式改成Promise API的形式了，返回的是一个Promise 。也是说 push和replace都是Promise类型了。
// 而Promise的回调函数resolve和reject，必须传其中一个，否则会报错。如果路由地址跳转相同，且没有捕获到错误，控制台始终会出现上图所出现的问题。​
// 第一个参数：告诉原来push方法，你往哪里跳转(传递哪些参数)
// 第二个参数：成功回调
// 第三个参数：失败的回调
// call||apply区别：
// 相同点：都可以调用函数一次，都可以篡改函数的上下文一次
// 不同点：call传递参数用逗号隔开，apply方法执行传递数组
// VueRouter.prototype.push = function (location, reslove, reject) {
//     if (reslove && reject) {

//         // 这里为什么要用call方法 因为这里的orginPush在外部所以挂载在window上 而VueRouter.prototype.push的this指向应该是VueRouter才对
//         //  所以这里就用call方法把orginPush的this指向从新指回VueRouter 这个函数里面的this指向就是VueRouter
//         orginPush.call(this, location, reslove, reject)
//     } else {
//         orginPush.call(this, location, () => { }, () => { })


//     }
// }

VueRouter.prototype.push = function push(location) {
    orginPush.call(this, location, () => { }, () => { })
}

VueRouter.prototype.replace = function replace(location) {
    orainReplace.call(this, location, () => { }, () => { })
}

// VueRouter.prototype.replace = function (location, reslove, reject) {
//     if (reslove && reject) {
//         orainReplace.call(this, location, reslove, reject)
//     } else {
//         orainReplace.call(this, location, () => { }, () => { })
//     }
// }
// 配置路由
let router = new VueRouter({
    // 配置路由 要注意的时routes里面对象里面的属性不能胡乱写，只能写里面配置了的
    //    文件太多了 所以把routes暴露的东西放在另外一个文件夹里面了
    routes,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
        //这个y=0代表 页面加载出来始终滚动到顶部  
        return { y: 0 }
    },
})
// 全局前置守卫：在路由跳转之前进行判断
router.beforeEach(async (to, from, next) => {
    // to:可以获取到你要跳转到那个路由信息 from:可以获取到你从那里来的信息 
    // next：放行函数 直接调用就是直接放行 1.next()  2.放行到指定路由next(path) path参数是路由路径 3.next(false)，暂时不管
    // next()
    // 用户未登录一定没有token，登陆了才有token
    let token = store.state.registerandlogin.token
    // 这里要用的这个对象里面的属性 name 这个属性是用户名 不能直接用这个对象 因为空对象也是真
    let userInfo = store.state.registerandlogin.userInfo
    if (token) {
        // 用户已经登陆了不允许去login路由或注册路由了 停留在首页home路由
        if (to.path === '/login' || to.path === '/register') {
            next('/')
        } else {
            // 登陆了但去的不是login  如果用户名存在 什么时候出现用户信息包括里面的用户名会消失 到别的路由比如search刷新一次 用户名就会消失
            // 当没用登录的用户登录时 由于获取token接口是在跳转到home路由之前 所以token在跳转到home组件之前就拿到了 所以现在在全局前置守卫所处的状态是token存在了 
            if (userInfo.name) {
                next()
            } else {
                //这里用trycatch的原因是 会出现一种情况 去的路径不是login且token虽然存在 但可能由于事件太长token失效了 导致获取不到用户信息，那么就从新登录
                try {
                    // 没用用户信息就派发action获取用户信息然后再跳转 当刷新页面也会派发 就不会出现 到search刷新用户信息消失的情况  home里面的派发删掉了
                    await store.dispatch('registerandlogin/getUserInfo')
                    next()
                } catch (error) {
                    // token失效了 那么就向服务器请求删除token 并跳转到login页面从新登陆
                    await store.dispatch('registerandlogin/userLogout')
                    next('/login')
                }
            }
        }
    }
    // 用户未登录也就是没用token的时候不能去交易trade相关，不能去支付相关pay，paysuccess，不能去个人中心 
    // 去的不是上面的路由就放行（home|search|shopcart）
    else {
        if (to.path === '/trade' || to.path === '/pay' || to.path === '/paysuccess' || to.path === '/center' || to.path === '/shopcart') {
            //    把未登录的时候想去但是没用去成的路由地址存储在地址栏的query中 然后当你跳转到登录页登录成功之后跳转到你原先登录失败的路由去
            next(`/login?redirect=${to.path}`)
        } else {
            next()
        }
    }
})

export default router