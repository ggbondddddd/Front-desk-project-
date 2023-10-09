// 从api的index.js里面获得数据
import { reqCategoryList, reqFloorList, reqGetBannerList, dataa } from '@/api'
// 暴露可以把state action放在外面 然后把这些参数带入也可 或者如下
import axios from 'axios'
export default {
    // 模块化在count和person里面想要简写必须加这个属性 如 ...mapMutations('countAbout', { increment: 'JIA', decrement: 'JIAN' }),
    namespaced: true,
    // home模块的vuex小仓库
    state: {
        // state中数据默认初始值别瞎写，服务器返回的是对象，起始值就是对象；返回的是数组，起始值就是数组
        // home仓库中储存三级菜单的数据
        categoryList: [],
        // 轮播图的数据
        bannerList: [],
        // floor组件的数据
        floorList: []
    },
    actions: {
        // 通过api里面的接口函数调用，向服务器发请求，获取服务器的数据
        // 这里利用了对象结构 不是很明白 解构赋值context.commit
        async categoryList({ commit }) {
            // 这是一个请求把 对数据发起请求 一个对axios进行了二次封装也就是一定加工的请求
            // 这一步是接收服务器返回的结果 把需要的信息拿到 然后commit给mutation

            let result = await reqCategoryList()

            if (result.code === 200) {
                commit('CATEGORYLIST', result.data)
            }
        },
        // 获取首页轮播图的数据 如果没用写这个async 和await 返回的就是包含具体数据的一个promise实例对象 写了直接返回数据
        async getBannerList({ commit }) {
            // 这一步是接收服务器返回的结果 把需要的信息拿到 然后commit给mutation

            let result = await reqGetBannerList()
            // 返回的result数据里面有code这个属性 值是200
            if (result.code === 200) {
                commit('GETBANNERLIST', result.data)
            }
        },
        // 获取floor数据
        async getFloorList({ commit }) {
            let result = await reqFloorList()
            if (result.code === 200) {
                commit('GETFLOORLIST', result.data)
            }
        },
    },
    mutations: {
        // 此处categoryList只不过是自己定义的一个参数 其实就是上面传过来的result.data
        CATEGORYLIST(state, categoryList) {
            state.categoryList = categoryList
        },
        GETBANNERLIST(state, bannerList) {
            state.bannerList = bannerList
        },
        GETFLOORLIST(state, floorList) {
            state.floorList = floorList
        }
    },
    // 计算属性
    getters: {},

}