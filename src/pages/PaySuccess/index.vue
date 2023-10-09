<template>
  <div class="paysuccess">

    <div class="success">
      <h3>
        <img src="./images/right.png" width="48" height="48">
        恭喜您，支付成功啦！
      </h3>
      <div class="paydetail">
        <p class="button">
          <router-link class="btn-look" to="/center">查看订单</router-link>
          <router-link class="btn-goshop" to="/">继续购物</router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PaySuccess',
  // 组件内守卫
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被confirm前调用 不能获取组件实例this 因为守卫执行前路由还没有生成
    if (from.path === '/pay') {
      next()
    } else {
      next(false)
    }
  },
  // beforeRouteUpdate(to,from,next){
  //   // 在当前路由改变，但是该路由被复用时调用 举例动态路径 /foo/:id,在/foo/1和/foo/2之间跳转的时候 由于渲染的时同一个food组件 这种情况这个钩子被调用
  // 比如有二级路由的时候 一级路由有好几个二级路由，当二级路由发生变化时这个钩子会调用
  // }，
  // beforeRouteLeave (to, from, next) {
  // 导航离开该组件对应的路由时调用 可以访问到this
  // }
}
</script>

<style lang="less" scoped>
.paysuccess {
  margin: 20px auto;
  padding: 25px;
  border: 1px solid rgb(211, 211, 211);
  width: 1200px;
  width: 1148px;

  .success {
    width: 500px;
    margin: 0 auto;

    h3 {
      margin: 20px 0;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;

      img {
        max-width: 100%;
        vertical-align: middle;
        border: 0;
        margin-right: 14px;
      }
    }

    .paydetail {
      margin-left: 66px;
      font-size: 15px;

      .button {
        margin: 30px 0;
        line-height: 26px;

        a {
          display: inline-block;
          box-sizing: border-box;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          border-radius: 2px;
          user-select: none;
          font-size: 18px;
          padding: 4px 20px;
          line-height: 22px;
          text-decoration: none;

          &.btn-look {
            margin-right: 13px;
            color: #fff;
            background-color: #e1251b;
            border: 1px solid #e1251b;
          }

          &.btn-goshop {
            color: #666;
            background-color: #eee;
            border: 1px solid #e1e1e1;
          }
        }
      }
    }
  }
}
</style>