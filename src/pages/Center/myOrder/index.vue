<template>
    <!-- center右侧内容 二级路由-->
    <div class="order-right">
        <div class="order-content">
            <div class="title">
                <h3>我的订单</h3>
            </div>
            <div class="chosetype">
                <table>
                    <thead>
                        <tr>
                            <th width="29%">商品</th>
                            <th width="31%">订单详情</th>
                            <th width="13%">收货人</th>
                            <th>金额</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="orders">
                <!-- 每一笔大订单 就是每一次支付成功加入订单的商品 -->
                <table class="order-item" v-for="(order, index) in myOrder.records">
                    <thead>
                        <tr>
                            <th colspan="5">
                                <span class="ordertitle">{{ order.createTime }}　订单编号：{{ order.outTradeNo }} <span
                                        class="pull-right delete"><img src="../images/delete.png"></span></span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- 这里是每一个大订单里面买的不同产品 可能有几个 遍历出来 但是像名字总金额这些不应该遍历出那里面多次 一次即可 -->
                        <tr v-for="(cart, index) in order.orderDetailList">
                            <td width="60%">
                                <div class="typographic">
                                    <img :src="cart.imgUrl" style="width: 100px;height: 100px;">
                                    <a href="#" class="block-text">{{ cart.skuName }}</a>
                                    <span>x{{ cart.skuNum }}</span>
                                    <a href="#" class="service">售后申请</a>
                                </div>
                            </td>
                            <!-- rowspan 属性规定单元格可横跨的行数 意思就是上下行 如果这个等于2 那么上下两行中间的横线会消失 -->
                            <!-- 然后下面这些属性只要第一次 后面的不要 因为都是一摸一样的数据  用index===0判断就可以实现 -->
                            <td :rowspan="order.orderDetailList.length" v-if="index === 0" width="8%" class="center">{{
                                order.consignee }}</td>
                            <td :rowspan="order.orderDetailList.length" v-if="index === 0" width="13%" class="center">
                                <ul class="unstyled">
                                    <li>总金额¥{{ order.totalAmount }}</li>
                                    <li>在线支付</li>
                                </ul>
                            </td>
                            <td :rowspan="order.orderDetailList.length" v-if="index === 0" width="8%" class="center">
                                <a href="#" class="btn">{{ order.orderStatusName }} </a>
                            </td>
                            <td :rowspan="order.orderDetailList.length" v-if="index === 0" width="13%" class="center">
                                <ul class="unstyled">
                                    <li>
                                        <a href="mycomment.html" target="_blank">评价|晒单</a>
                                    </li>

                                </ul>
                            </td>
                        </tr>

                    </tbody>
                </table>


            </div>
            <!-- 全局组件分页器 在search里面也有 -->
            <Pagination :pageNo="page" :pageSize="limit" :total="myOrder.total" :continues="5" @getPageNo="getPageNo" />
        </div>
        <!--猜你喜欢-->
        <div class="like">
            <h4 class="kt">猜你喜欢</h4>
            <ul class="like-list">
                <li class="likeItem">
                    <div class="p-img">
                        <img src="../images/itemlike01.png" />
                    </div>
                    <div class="attr">
                        <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
                    </div>
                    <div class="price">
                        <em>¥</em>
                        <i>3699.00</i>
                    </div>
                    <div class="commit">已有6人评价
                    </div>
                </li>
                <li class="likeItem">
                    <div class="p-img">
                        <img src="../images/itemlike02.png" />
                    </div>
                    <div class="attr">
                        Apple苹果iPhone 6s/6s Plus 16G 64G 128G
                    </div>
                    <div class="price">
                        <em>¥</em>
                        <i>4388.00</i>
                    </div>
                    <div class="commit">已有700人评价
                    </div>
                </li>
                <li class="likeItem">
                    <div class="p-img">
                        <img src="../images/itemlike03.png" />
                    </div>
                    <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本
                    </div>
                    <div class="price">
                        <em>¥</em>
                        <i>4088.00</i>
                    </div>
                    <div class="commit">已有700人评价
                    </div>
                </li>
                <li class="likeItem">
                    <div class="p-img">
                        <img src="../images/itemlike04.png" />
                    </div>
                    <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本
                    </div>
                    <div class="price">
                        <em>¥</em>
                        <i>4088.00</i>
                    </div>
                    <div class="commit">已有700人评价
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyOrder',
    data() {
        return {
            // 初始化参数
            // 当前第几页
            page: 1,
            // 每一页展示数据个数
            limit: 3,
            // 存储我的订单的数据
            myOrder: {}
        }
    },
    mounted() {
        // 获取我的订单方法
        this.getData()
    },
    methods: {
        // 获取我的订单的方法
        async getData() {
            // 解构出参数 这里原理是 在this里面找到data 然后data里面参数被解构
            const { page, limit } = this
            let result = await this.$API.reqMyOrderList(page, limit)
            if (result.code === 200) {
                this.myOrder = result.data
            }
        },
        // 获取当前点击的那一页
        getPageNo(page) {
            // 修改组件响应式数据
            this.page = page
            this.getData()
        }
    },

}
</script>

<style lang="scss" scoped></style>