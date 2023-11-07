import { reqGetSearchInfo, } from '@/api'
// search模块的小仓库
const state = {
    // 仓库初始状态
    searchList: {}
}
const actions = {
    // 获取search模块数据
    async getSearchList({ commit }, params = {}) {
        // 当前这个reqGetSearchInfo函数在调用获取服务器数据的时候，至少传递一个参数(空对象)
        // params形参：是当用户派发action的时候，第二个参数传递过来的，至少是一个空对象 params={}就是params没传值就默认是{}
        // 这一步是接收服务器返回的结果 把需要的信息拿到 然后commit给mutation
        let result = await reqGetSearchInfo(params)
        if (result.code === 200) {
            commit('GETSEARCHLIST', result.data)
        }
    }
}
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
    }
}
// getters计算属性 在项目中为了简化数据而生
// 可以把我们将来在组件当中需要用的数据简化（将来组件在获取数据的时候就方便了）
const getters = {
    // 当前形参state是search仓库中的state，不包括home仓库里面的state
    goodList(state) {
        // 可能网络很慢 数据回来很慢 那么就会undefined 空数组就不会undefined
        return state.searchList.goodsList || []
    },
    trademarkList(state) {
        return state.searchList.trademarkList || []
    },
    attrsList(state) {
        return state.searchList.attrsList || []
    }
}
export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}