<template>
    <!-- 商品分类导航 -->
    <div class="type-nav">

        <div class="container">
            <!--  把鼠标移除委托给他们父元素  -->
            <div @mouseleave="leaveShow" @mouseenter="enterShow">
                <h2 class="all">全部商品分类</h2>
                <!-- 过渡动画 -->
                <transition name="sort">
                    <!-- 三级联动 -->
                    <div class="sort" v-show="show">
                        <div class="all-sort-list2" @click="goSearch">
                            <!-- cur 这一步是添加背景色  这样currentIndex和点击获取的那个index相同 对应的那个一级标签才会添加背景色-->
                            <div class="item " v-for="(c1, index) in categoryList.slice(0, 16)" :key="c1.categoryId"
                                :class="{ cur: currentIndex === index }">
                                <h3 @mouseenter="changeIndex(index)">
                                    <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{
                                        c1.categoryName
                                    }}</a>
                                </h3>
                                <!-- 二级分类和三级分类 -->
                                <!-- 此处的：style就是控制二级分类显示和隐藏的 -->
                                <div class="item-list clearfix"
                                    :style="{ display: currentIndex === index ? 'block' : 'none' }">
                                    <div class="subitem" v-for="(c2, index) in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{
                                                    c2.categoryName }}</a>
                                                <!-- <router-link to="/search">{{ c2.categoryName }}</router-link> -->

                                            </dt>
                                            <dd>
                                                <!-- 这一步我刚刚写在了dd里面 样式就出了问题 -->
                                                <em v-for="(c3, index) in c2.categoryChild" :key="c3.categoryId">
                                                    <a :data-categoryName="c3.categoryName"
                                                        :data-category3Id="c3.categoryId">{{
                                                            c3.categoryName }}</a>


                                                </em>

                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </transition>

            </div>
            <nav class="nav">
                <a href="###">服装城</a>
                <a href="###">美妆馆</a>
                <a href="###">尚品汇超市</a>
                <a href="###">全球购</a>
                <a href="###">闪购</a>
                <a href="###">团购</a>
                <a href="###">有趣</a>
                <a href="###">秒杀</a>
            </nav>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// 引入方式：是把lodash全部功能函数引入
// import _ from 'lodash'
// 最好的引入 按需引入
import throttle from 'lodash/throttle'

export default {
    name: 'TypeNav',
    data() {
        return {
            // 存储用户鼠标移动到那一个一级分类
            currentIndex: -1,
            show: true,
        }
    },
    // 组件挂载完毕，可以通知服务器发请求
    mounted() {
        // // 通知vuex发请求，获取数据，存储于仓库当中
        // this.$store.dispatch('home/categoryList')
        // 当组件挂载完毕，让show属性变为false
        // 如果不是Home路由组件，将typeNav这个三级分类进行隐藏
        if (this.$route.path !== '/home') {
            this.show = false
        }
    },
    computed: {
        ...mapState("home", ["categoryList"])
    },
    methods: {
        // 这里利用了节流
        // 鼠标进入 修改响应式数据currentIndex属性 然后增加背景颜色 其实就是hover
        changeIndex: throttle(function (index) {
            // index:鼠标移动到某个一级分类对应那个一级分类的索引值、
            this.currentIndex = index
        }, 50),
        // 一级分类鼠标移出这个一级分类的事件回调 以及在search路由组件的部分功能
        leaveShow() {
            this.currentIndex = -1
            // 判断如果是Search路由组件的时候才会执行
            if (this.$route.path !== "/home") {
                // 当鼠标离开的时候，让商品分类列表隐藏
                this.show = false
            }
        },
        // 进行路由跳转 这里运用了事件委派 直接把这个编程式导航放到了包含整个一二三级分类的大标签里面 可以实现点击每一个都跳转
        goSearch(e) {
            // 存在的问题:只想在点击a标签才跳转 但是点击h3 dt dl em也会跳转 以及哪怕知道了点击的是a标签 如何区分是一级,二级还是三级分类
            // 在上面给a标签添加一个自定义属性:data-categoryName 可以通过e.target.dataset获取 每一级:data-categoryName的值不一样

            // 对象解构 DOMStringMap {v-18b3c0cc: '', categoryname: '家居家装'}是e.target.dataset打印出的数据 然后
            //let {categoryname}= e.target.dataset 就是让categoryname等于DOMStringMap 这个对象里面的categoryname的属性的值
            let { categoryname, category1id, category2id, category3id } = e.target.dataset
            // console.log(e.target.dataset)

            // 只有当categoryname存在才执行函数 什么时候存在 只有点击a存在 因为只在a里面放了这个自定义属性
            if (categoryname) {
                // 
                if (this.$route.params) {
                    // this.$router.push('/search')
                    // 判断是一级还是二级还是三级分类的a标签
                    if (category1id) {
                        this.$router.push({
                            // 整理路由跳转的参数
                            name: 'search',
                            query: {
                                categoryName: categoryname,
                                category1Id: category1id,
                            },
                            // 当你跳转时携带搜索框的搜索参数 这里三级分类时用query储存数据 搜索框是params 所以可以实现这个效果 
                            params: this.$route.params
                        })
                    } else if (category2id) {
                        this.$router.push({
                            // 整理路由跳转的参数
                            name: 'search',
                            query: {
                                categoryName: categoryname,
                                category2Id: category2id,
                            },
                            params: this.$route.params
                        })
                    } else {
                        this.$router.push({
                            // 整理路由跳转的参数
                            name: 'search',
                            query: {
                                categoryName: categoryname,
                                category3Id: category3id,
                            },
                            params: this.$route.params
                        })
                    }
                }
            }

        },
        // 当鼠标移入的时候，让商品分类列表进行展示
        enterShow() {
            if (this.$route.path !== '/home') {
                this.show = true
            }
        }
    }


}
</script>

<style lang="less" scoped>
.type-nav {
    border-bottom: 2px solid #e1251b;

    .container {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        position: relative;

        .all {
            width: 210px;
            height: 45px;
            background-color: #e1251b;
            line-height: 45px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }

        .nav {
            a {
                height: 45px;
                margin: 0 22px;
                line-height: 45px;
                font-size: 16px;
                color: #333;
            }
        }

        .sort {
            position: absolute;
            left: 0;
            top: 45px;
            width: 210px;
            height: 461px;
            position: absolute;
            background: #fafafa;
            z-index: 999;


            .all-sort-list2 {
                .item {
                    h3 {
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: 400;
                        overflow: hidden;
                        padding: 0 20px;
                        margin: 0;

                        a {
                            color: #333;
                        }
                    }

                    .item-list {
                        display: none;
                        position: absolute;
                        width: 734px;
                        min-height: 460px;
                        background: #f7f7f7;
                        left: 210px;
                        border: 1px solid #ddd;
                        top: 0;
                        z-index: 9999 !important;

                        .subitem {
                            float: left;
                            width: 650px;
                            padding: 0 4px 0 8px;

                            dl {
                                border-top: 1px solid #eee;
                                padding: 6px 0;
                                overflow: hidden;
                                zoom: 1;

                                &.fore {
                                    border-top: 0;
                                }

                                dt {
                                    float: left;
                                    width: 54px;
                                    line-height: 22px;
                                    text-align: right;
                                    padding: 3px 6px 0 0;
                                    font-weight: 700;
                                }

                                dd {
                                    float: left;
                                    width: 415px;
                                    padding: 3px 0 0;
                                    overflow: hidden;

                                    em {
                                        float: left;
                                        height: 14px;
                                        line-height: 14px;
                                        padding: 0 8px;
                                        margin-top: 5px;
                                        border-left: 1px solid #ccc;
                                    }
                                }
                            }
                        }
                    }

                    // &:hover {
                    //     .item-list {
                    //         display: block;
                    //     }
                    // }
                }

                // 给经过的那个一级索引添加背景颜色
                .cur {
                    background: skyblue;
                }
            }
        }

        // 过渡动画的样式
        // 过渡动画开始状态(进入)
        .sort-enter {
            height: 0px;

        }

        .sort-enter-to {
            height: 461px;
        }

        .sort-enter-active {
            transition: all .5s linear;
        }

    }
}
</style>