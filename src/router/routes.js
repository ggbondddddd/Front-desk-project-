// 引入路由组件
// import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Search from '@/pages/Search'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
// 引入二级路由
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'

//路由懒加载优势在于： 当打包构建应用时，js包会变得很大，影响页面加载。
// 如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，会更高效，相当于数=是按需引入
export default [
    {
        path: '/center',
        component: Center,
        // 路由元信息 可以通过$route.meta获得
        meta: { show: true },
        // 二级路由组件  children是一个数组 
        children: [
            {
                // 二级路由不用带反斜杠 如果非要带反斜杠就要完整写出来/center/myorder
                path: 'myorder',
                component: MyOrder
            },
            {
                path: 'grouporder',
                component: GroupOrder
            },
            {
                // 从定向 默认在center路由显示二级路由myorder
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    {
        path: '/home',
        component: () => import('@/pages/Home'),
        // 路由元信息 可以通过$route.meta获得
        meta: { show: true }
    },
    {
        path: '/login',
        component: Login,
        meta: { show: false }

    },
    {
        path: '/register',
        component: Register,
        meta: { show: false }
    }, {
        name: 'search',//注意 想要传输params参数的时候只能用name当作path 因为path要为params占位 
        // 此处这个？是什么含义忘记了
        path: '/search/:keyword?',
        component: Search,
        meta: { show: true },
        // props第一种写法 只能传递params参数
        // props: true
        // 对象写法，可以额外给路由组件传递一些参数
        // props：[a:1,b:2]
        // 函数写法：可以params参数，query参数，通过props传递给路由组件
        props($route) {
            return { keyword: $route.params.keyword, k: $route.query.k }
        }

    },
    {
        // name: 'detail',
        path: '/detail/:skuid',
        component: Detail,
        meta: { show: true }
    },
    {
        name: 'addcartsuccess',
        path: '/addcartsuccess',
        component: AddCartSuccess,
        meta: { show: true }
    },
    {
        name: 'shopcart',
        path: '/shopcart',
        component: ShopCart,
        meta: { show: true }
    },
    {
        name: 'trade',
        path: '/trade',
        component: Trade,
        meta: { show: true },
        // 路由独享守卫 在这个组件上一个组件进入这个组件之前的判断 
        beforeEnter: (to, from, next) => {
            // 只能从shopcart跳到trade 其他路由都不能直接跳过来
            if (from.path === '/shopcart') {
                next()
            } else {
                // 两种停留都可以
                // next(from.path)
                //简单说next(false)就是，如果浏览器url变了，从哪来回哪去，和next(from.path)是一个意思，相当于停留在当前
                next(false)
            }
        }
    },
    {
        name: 'pay',
        path: '/pay',
        component: Pay,
        meta: { show: true },
        beforeEnter: (to, from, next) => {
            if (from.path === '/trade') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        name: 'paysuccess',
        path: '/paysuccess',
        component: PaySuccess,
        meta: { show: true }
    },
    // 重定向 就是页面展示的时候默认初次展示自己设定的那一个路由组件
    {
        path: '*',
        redirect: '/home'
    }
]