// 从api的index.js里面获得数据
import { reqGoodInfo, reqAddUpdateShopCart } from '@/api'
// 封装游客身份模块uuid     生成一个随机字符串（不能变了）
import { getUUID } from '@/utils/uuid_token'
// 暴露可以把state action放在外面 然后把这些参数带入也可 或者如下
export default {
    // 模块化在count和person里面想要简写必须加这个属性 如 ...mapMutations('countAbout', { increment: 'JIA', decrement: 'JIAN' }),
    namespaced: true,
    state: {
        goodInfo: {},
        // 游客临时身份
        uuid_token: getUUID()
    },
    // actions里面所有的函数如果不加async和await 得到的结果都是一个promise 貌似加了以后就可以直接拿到这个promise里面的具体返回数据
    actions: {
        // 获得产品信息
        async getGoodInfo({ commit }, skuId) {
            // 这一步是接收服务器返回的结果 把需要的信息拿到 然后commit给mutation
            let result = await reqGoodInfo(skuId)
            if (result.code === 200) {
                commit('GETGOODINFO', result.data)
            }

        },
        // 将产品添加到购物车中 此处的{ skuId, skuNum }也是解构
        async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
            // 加入购物车以后（发请求），前端将一些参数带给服务器(需要存储这些数据) 服务器写入数据成功，并不会返回其他数据,只是返回code==200代表这次操作成功
            // 因为服务器根本没用返回具体的data数据，所有不需要三连环存储数据
            let result = await reqAddUpdateShopCart(skuId, skuNum)
            // console.log(result)
            if (result.code == 200) {
                return 'ok'
            } else {
                // 代表加入购物车失败
                return Promise.reject(new Error('faile'))
            }
        }
    },
    mutations: {
        GETGOODINFO(state, goodInfo) {
            state.goodInfo = goodInfo
        }
    },
    // 简化数据而生
    getters: {
        // 路径导航简化的数据
        categoryView(state) {
            // state.categoryInfo初始状态是undefined，空对象的categoryView属性值undefined 所以要或一个[]这样加载成功前可以不报错
            // 实质上是因为actions进行异步操作时，getters要依赖actions请求回来的数据，在数据没用返回之前，getters是undefined所以要||{}
            return state.goodInfo.categoryView || {}
        },
        // 简化产品信息的数据
        skuInfo(state) {
            return state.goodInfo.skuInfo || {}
        },
        // 产品售卖属性的简化
        spuSaleAttrList(state) {
            return state.goodInfo.spuSaleAttrList || []
        }
    },

}