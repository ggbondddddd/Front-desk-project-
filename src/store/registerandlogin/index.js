// 登录与注册模块
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from '@/api'
// 引入token直接本地存储这个函数
import { setToken, getToken, removeToken } from '@/utils/token'
export default {
    namespaced: true,
    state: {
        code: '',
        // 由于仓库数据不是持久化，一刷新页面就消失那么token也就消失了，所以此处是让token等于获取token本地存储这个函数
        token: getToken(),
        // 这里就是用户登录具体的信息
        userInfo: {}
    },
    actions: {
        // 获取验证码这个接口，把验证码返回。但是正常情况是后台把验证码发给用户手机上（这里发给自己因为省钱）
        async getCode({ commit }, phone) {
            let result = await reqGetCode(phone)
            if (result.code === 200) {
                commit('GETCODE', result.data)
                return 'ok'
            } else {
                return Promise.reject(new Error('faile'))
            }
        },
        // 用户注册
        async userRegister({ commit }, user) {
            // 这里并不会返回数据 只是告诉服务器我注册了 
            let result = await reqUserRegister(user)
            // console.log(result)
            if (result.code === 200) {
                return 'ok'
            } else {
                return Promise.reject(new Error('faile'))
            }
        },
        // 用户登录（token 令牌的意思） 
        async userLogin({ commit }, data) {

            let result = await reqUserLogin(data)
            // 这里服务器自动给你生成一个token,是用户唯一标识符，在result.data里，类似于（uuid），不过uuid是我们自己生成的 
            // 将来经常通过token找服务器要用户信息进行展示
            // console.log(result)
            if (result.code === 200) {
                commit('USERLOGIN', result.data.token)
                // 持久化存储token 只不过是把存储封装成了一个函数 然后引入进来用而已
                setToken(result.data.token)
                return 'ok'
            } else {
                return Promise.reject(new Error('faile'))
            }
        },
        // 获取用户信息放在home组件上
        async getUserInfo({ commit }) {
            let result = await reqUserInfo()
            // console.log(result)
            if (result.code === 200) {
                // 提交用户信息 
                commit('GETUSERINFO', result.data)
                return 'ok'
            }
            // 此处我理解的不能由else的原因 退出登录以后token消失了 那么home就获取不到用户数据  肯定会报错 当你退出登录也就是没用用户的时候刷新路由会自动
            // 回到home页面所以也会报错
            // else {
            //     return Promise.reject(new Error('faile'))
            // }
        },
        // 退出登录
        async userLogout({ commit }) {
            // 只是向服务器发起一次请求，通知服务器清除token
            let result = await reqLogout()
            // console.log(result)
            // action里面不可以操作state
            if (result.code === 200) {
                commit('CLERA')
                return 'ok'
            } else {
                return Promise.reject(new Error('faile'))
            }
        }
    },
    mutations: {
        GETCODE(state, code) {
            state.code = code
        },
        USERLOGIN(state, token) {
            state.token = token
        },
        GETUSERINFO(state, userInfo) {
            state.userInfo = userInfo
        },
        // 收到退出登录提醒 清除本地数据token
        CLERA(state) {
            // 把仓库中相关用户数据清空
            state.token = ''
            state.userInfo = {}
            // 清除token函数 在utils/token里面
            removeToken()

        }
    },
    getters: {}
}