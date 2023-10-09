import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from '@/api'
export default {

    namespaced: true,

    state: {
        cartList: []
    },
    // action里面的函数可以传参context这个context打印出来就是store 里面有state getter mutation actions  可以通过这个实现actions里面函数调用actions里面
    // 另外一个函数的功能 如 a b都是actions里面函数 a调用b 可以 a函数里面 context.dispatch('b',形参) 即可
    actions: {
        // 获取购物车列表数据
        async getCartList({ commit }) {
            let result = await reqCartList()
            // console.log(result)
            if (result.code === 200) {
                commit('GETCARTLIST', result.data)
            }
        },
        // 删除购物车某一个产品 只是通知服务器删除数据 并不会返回数据 删除不需要返回数据 很好理解
        async deleteCartListBySkuId({ commit }, skuId) {
            let result = await reqDeleteCartById(skuId)
            // console.log(result)
            if (result.code === 200) {
                return 'ok'
            } else {
                return Promise.reject(new Error('faile'))
            }
        },
        // 修改购物车某一个产品选中状态
        async updateCheckedById({ commit }, { skuId, isChecked }) {
            let result = await reqUpdateCheckedById(skuId, isChecked)
            // console.log(result)
            if (result.code === 200) {
                return 'ok'
            } else {
                return Promise.reject(new Error('faile'))
            }
        },
        // 修改全部产品状态 点击全选全部勾选
        updateAllCartIsChecked({ dispatch, state }, isChecked) {
            let promiseAll = []
            state.cartList[0].cartInfoList.forEach(item => {
                let promise = dispatch('updateCheckedById', { skuId: item.skuId, isChecked })
                // console.log(promise)
                promiseAll.push(promise)
            })
            // 最终返回结果  Promise.all方法会将多个promise实例包装成一个新的promise 只有里面所有的promise的状态变为fulfilled 这个新promise的状态
            // 才会变成fulfilled
            // console.log(Promise.all(promiseAll))
            return Promise.all(promiseAll)
        }
    },
    mutations: {
        GETCARTLIST(state, cartList) {
            state.cartList = cartList
        }
    },
    // 计算属性
    getters: {
        cartList(state) {
            return state.cartList[0] || {}
        },
        // cartInfoList(state){
        //     return state.
        // }
    },

}