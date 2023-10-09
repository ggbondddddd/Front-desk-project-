// api里面这个模块：API进行统一管理

// 此处这个requests其实是在request.js里面对axios进行二次封装
import requests from './request'
import mockRequests from './mockAjax'

// import { metadata } from 'core-js/fn/reflect'

// 三级联动接口
//  /api/product/getBaseCategoryList get 无参数

// 对外暴露一个函数，只要外部调用这个函数，就向服务器发生ajax请求，获取到三级菜单数据。当前这个函数执行需要把服务器返回结果返回
export const reqCategoryList = () => {
    // 发请求：axios发请求返回结果是Promise对象   
    // 这里必须把requests返回回去 因为此时reqCategoryList
    return requests({ url: '/product/getBaseCategoryList', method: 'get' })
}

// 获取banner （home首页轮播图接口） 上面是对象写法 下面是简写写法
// export const reqGetBannerList=()=>mockRequests.get('/banner')
export const reqGetBannerList = () => {
    // 这里不知道为啥 不需要写mock这个路径前缀
    return mockRequests({ url: '/banner', method: 'get' })
}

// 获取floor数据
// export const reqFloorList = () => mockRequests.get('/floor')
export const reqFloorList = () => {
    return mockRequests({ url: '/floor', method: 'get' })
}



// 获取search搜索模块数据 地址：/api/list 请求方式：post 参数：需要带参数
// 当前这个接口(搜索模块的数据)，给服务器传递的参数params，至少是一个空对象  params来自store的action 
export const reqGetSearchInfo = (params) => requests({ url: "/list", method: "post", data: params })

// 获取产品详细信息的接口，detail仓库里  URL：/api/item/{skuId} 需要传参 参数也来自store里面的action  
export const reqGoodInfo = (skuId) => requests({ url: `/item/${skuId}`, method: 'get' })

// 将产品添加到购物车中并且可以更新产品的个数，detail仓库里 url:/api/cart/addToCart/{skuId}/{skuNum} 这个接口不返回数据，只告诉你数据传递成功
export const reqAddUpdateShopCart = (skuId, skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'post' })

//获取购物车列表数据接口，shopcart仓库  url： /api/cart/cartList   method:get
export const reqCartList = () => requests({ url: '/cart/cartList', method: 'get' })

// 删除购物车产品接口，shopcart仓库 url：/api/cart/deleteCart/{skuId} method:delete
export const reqDeleteCartById = (skuId) => requests({ url: `/cart/deleteCart/${skuId}`, method: 'delete' })

// 修改购物车里面商品复选框选不选的状态，shopcart仓库 url:/api/cart/checkCart/{skuId}/{isChecked} 
export const reqUpdateCheckedById = (skuId, isChecked) => requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'get' })

// 获取验证码 /api/user/passport/sendCode/{phone} method：get
export const reqGetCode = (phone) => requests({ url: `/user/passport/sendCode/${phone}`, method: 'get' })

// 注册接口 url:/api/user/passport/register  method:post 要携带的参数 phone手机号,code验证码，password密码
export const reqUserRegister = (data) => requests({ url: '/user/passport/register', data, method: 'post' })

// 用户登录接口 url:/api/user/passport/login   method:post
export const reqUserLogin = (data) => requests({ url: '/user/passport/login', data, method: 'post' })

// 用户登录成功跳转到home页面时获取用户信息(需要携带用户的token向服务器要用户信息) url：/api/user/passport/auth/getUserInfo   method:get
export const reqUserInfo = () => requests({ url: '/user/passport/auth/getUserInfo', method: 'get' })

// 退出登录 url:/api/user/passport/logout  method:get
export const reqLogout = () => requests({ url: '/user/passport/logout', method: 'get' })

// 获取用户地址信息  url: /api/user/userAddress/auth/findUserAddressList      method:get 
export const reqAddressInfo = () => requests({ url: '/user/userAddress/auth/findUserAddressList', method: 'get' })

// 获取商品清单 url:/api/order/auth/trade    method:get         trade路由
export const reqOrderInfo = () => requests({ url: '/order/auth/trade', method: 'get' })

// 提交订单的接口 url:/api/order/auth/submitOrder?tradeNo={tradeNo}    method:post      trade路由
export const reqSubmitOrder = (tradeNo, data) => requests({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method: 'post' })

// 获取订单支付信息 url:/api/payment/weixin/creatNative/{orderId}  GET      pay路由
export const reqPayInfo = (orderId) => requests({ url: `/payment/weixin/createNative/${orderId}`, method: 'get' })

// 获取支付订单状态  支付成功呢还是支付失败了   url:/api/payment/weixin/queryPayStatus/{orderId}   get      pay路由
export const reqPayStatus = (orderId) => requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'get' })

// 获取个人中心数据    url:/api/order/auth/{page}/{limit}     get
export const reqMyOrderList = (page, limit) => requests({ url: `/order/auth/${page}/${limit}`, method: 'get' })
