<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(cart, list) in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <!-- cart里面的checked是上次的checked，因为此时还没有从派发把修改了checked传到那个接口  $event里面的checked是实时的 
              input框的event就是选中状态true或false-->
            <input type="checkbox" name="chk_list" :checked="cart.isChecked === 1" @click="updateChecked(cart, $event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('jian', -1, cart)">-</a>
            <!-- 这里*1的原因 input输入的是string *1就会转换成number -->
            <input autocomplete="off" type="text" minnum="1 " class="itxt" :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)">
            <a href="javascript:void(0)" class="plus" @click="handler('jia', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllCheck" @change="updateAllCartChecked">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 引入节流防抖
import throttle from 'lodash/throttle'
export default {
  name: 'ShopCart',
  mounted() {
    this.getDate()
  },
  methods: {
    // 获取个人购物车数据
    getDate() {
      this.$store.dispatch('shopcart/getCartList')
    },
    // 修改某一个产品的个数 节流   这里throttle必须用这种写法 不能handler(){} 
    handler: throttle(async function (type, disNum, cart) {
      // 目前disNum形参：+变化量（1） -变化量（-1） input最终的个数（并不是变化量）这里是后端规定的
      // cart:你点击的是那一个产品（身上有id）
      // 向服务器发请求，修改数量
      switch (type) {
        // 加号
        case 'jia':
          disNum = 1
          break
        case 'jian':
          // 产品个数必须大于一才可以-1 然后传递给服务器
          // 产品数量小于等于1 不增也不减 传递给服务器个数为0 
          disNum = cart.skuNum > 1 ? -1 : 0
          break
        case 'change':
          // 用户输入进来的最终量：非法的（带有汉字或出现负数）如：12个 就把12传给服务器
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0
          } else {
            // 正常情况 但是是小数 带给服务器的是变化的量 用户输入值-产品起始个数
            disNum = parseInt(disNum) - cart.skuNum
          }
      }
      // 派发action
      try {
        // 代表修改成功   这里参数本身设计的就有点不合理
        await this.$store.dispatch('detail/addOrUpdateShopCart', { skuId: cart.skuId, skuNum: disNum })
        // 再一次获取服务器最新数据进行展示
        this.getDate()
      } catch (error) {
        alert(error.message)
      }
    }, 1000),
    // 删除某一个产品的操作
    async deleteCartById(cart) {
      try {
        // 如果删除成功再次发请求获取新的数据进行展示
        await this.$store.dispatch('shopcart/deleteCartListBySkuId', cart.skuId)
        this.getDate()
      } catch (error) {
        alert(error.message)
      }
    },
    // 修改某一个产品的勾选状态  这里为什么要发请求 因为你哪怕修改了 没告知服务器 服务器不知道你改了 那那么数据其实还是没用改变
    async updateChecked(cart, event) {
      try {
        // 如果修改数据成功，再次获取服务器数据(购物车) 相当于是从新渲染页面
        // 带给服务器的参数应该是0或1而不是布尔值 这里的event.target.checked和上面的checked无关 就是单纯你点击的这个复选框的选择状态
        // 上面checked的判断是为了初始选不选中做判断 改变了event.target.checked的true，false并不会影响数据里面的checked等于1还是等于0 很关键
        let isChecked = event.target.checked ? '1' : '0'
        // console.log(isChecked)
        // 接口数据发送以后才会改变上面cart的checked的值是1还是0
        await this.$store.dispatch('shopcart/updateCheckedById', { skuId: cart.skuId, isChecked: isChecked })
        this.getDate()
      }
      catch (error) {
        alert(error.message)
      }
    },
    // 删除全部选中产品   遍历然后找出ischecked=1的元素然后遍历这些元素组成的数组依次派发删除掉就行
    deleteAllCheckedCart() {
      let res = this.cartInfoList.filter((item) => {
        return item.isChecked === 1
      })
      res.forEach((item) => {
        // 如果删除成功再次发请求获取新的数据进行展示
        this.$store.dispatch('shopcart/deleteCartListBySkuId', item.skuId)
        this.getDate()

      })


    },
    // 点击全选全部产品选中 和computed里面的是对应的
    async updateAllCartChecked(e) {
      try {
        let isChecked = e.target.checked ? '1' : '0'
        //  派发action
        await this.$store.dispatch('shopcart/updateAllCartIsChecked', isChecked)
        // 下面这种方法没用用到store仓库发请求 但是没用用store仓库完美 会依次变成全选框选中状态
        // this.cartInfoList.forEach((item) => {
        //   item.isChecked = isChecked
        //   this.$store.dispatch('shopcart/updateCheckedById', { skuId: item.skuId, isChecked: isChecked })
        //   console.log(item.isChecked)
        // })
        this.getDate()
      } catch (error) {
        alert(error.message)
      }
    }
  },
  computed: {
    ...mapGetters('shopcart', ['cartList']),
    // 购物车数据 这个数据不要写在getters里面 不知道为什么 后面foreach遍历的时候会出现找不到数据的情况 不知道为啥
    cartInfoList() {
      return this.cartList.cartInfoList || []
    },
    // 计算所有商品总价 筛选filter出选中的算总价 没勾选的不计算
    totalPrice() {
      let sum = 0
      let res = this.cartInfoList.filter((item) => {
        return item.isChecked === 1
      })
      res.forEach(element => {
        sum += element.skuNum * element.skuPrice
      })
      return sum
    },
    // 判断底部复选框是否勾选(全部产品都选中，就勾选)  并且数组长度必须大于0 不然购物车全部商品删除 全选会自动勾选
    // every 数组方法 遍历数组 当所有元素满足你给的条件返回true 有一个元素不满足就返回false
    isAllCheck() {
      if (this.cartInfoList.length > 1) {
        return this.cartInfoList.every(item => item.isChecked === 1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }



        .cart-list-con4 {
          width: 10%;

        }

        .cart-list-con5 {
          width: 15%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 12.5%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 12.5%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>