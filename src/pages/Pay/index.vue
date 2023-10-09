<template>
  <div class="pay-main">
    <!-- <el-button type="primary" icon="el-icon-plus">测试</el-button>
    <el-button :plain="true" icon="el-icon-plus" @click="open">使用 HTML 片段</el-button> -->
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{ orderId }}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{ payInfo.totalFee }}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg"></li>
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg"></li>
              <li><img src="./images/pay11.jpg"></li>
              <li><img src="./images/pay12.jpg"></li>
              <li><img src="./images/pay13.jpg"></li>
              <li><img src="./images/pay14.jpg"></li>
              <li><img src="./images/pay15.jpg"></li>
              <li><img src="./images/pay16.jpg"></li>
              <li><img src="./images/pay17.jpg"></li>
              <li><img src="./images/pay18.jpg"></li>
              <li><img src="./images/pay19.jpg"></li>
              <li><img src="./images/pay20.jpg"></li>
              <li><img src="./images/pay21.jpg"></li>
              <li><img src="./images/pay22.jpg"></li>

            </ul>
          </div>

        </div>
        <div class="hr"></div>

        <div class="submit">
          <!-- <router-link class="btn" to="/paysuccess">立即支付</router-link> -->
          <a class="btn" @click="open">立即支付</a>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: 'Pay',
  // 尽量不在生命周期函数不允许加async 可以用一个函数包住然后在这个函数里面async
  mounted() {
    this.getPayInfo()
  },
  data() {
    return {
      payInfo: {},
      timer: null,
      // 支付的状态码
      code: '',
    }
  },
  methods: {
    // 获取支付信息
    async getPayInfo() {
      let result = await this.$API.reqPayInfo(this.orderId)
      // 如果成功：组件中存储支付信息
      if (result.code === 200) {
        this.payInfo = result.data
      }
    },
    //弹出框 这个点击事件是直接从ElementUI复制过来的
    // 这个地方有一个特别重要的点就是 如果你没有定时器就执行最下面那个操作 然后等待 如果你扫码支付成功 服务器派发然后你收到支付成功的回调
    //  自动跳转到paySuccess路由 而elementUI里面的beforeClose是在你点击这两个按钮的时候进行判断 点击的是支付成功按钮跳转到paySuccess路由
    // 最大区别就是一个是点击成功跳转 一个是扫码支付成功自动跳转
    async open() {
      // 利用组件qrcode生成二维码的地址 await接收promise成功回调 这个promise的成功回调就是这个二维码地址
      let url = await QRCode.toDataURL(this.payInfo.codeUrl)
      // 下面这个alert是引入在原型对象上的elementUI的MessageBox.alert方法
      this.$alert(`<img src=${url} />`, '请微信支付', {
        dangerouslyUseHTMLString: true,
        // 中间布局
        center: true,
        // 是否显示取消按钮
        showCancelButton: true,
        // 取消按钮的文本内容
        cancelButtonText: '支付遇见问题',
        // 确认按钮的文本
        confirmButtonText: '已支付成功',
        // 右上角的x不显示
        showClose: false,
        // 关闭弹出框之前的配置
        beforeClose: (type, instance, done) => {
          // type:点击的是支付遇见问题按钮还是已支付成功按钮 instance：当前组件实例  done：关闭弹出框的方法
          if (type === 'cancel') {
            alert(' 请联系管理员')
            // 清除定时器   
            clearInterval(this.timer)
            this.tmier = null
            // 关闭弹出框
            done()
          }
          // 如果点击的是已确认支付按钮 
          else {
            // 判断是否真的支付了
            // 开发人员为了自己方便，这里判断先不要
            // if (this.code === 200) {
            clearInterval(this.timer)
            this.tmier = null
            done()
            this.$router.push('/paysuccess')
            // }
          }

        }
      })
      //当上面那个二维码弹框弹出来了 需要不断发请求知道支付成功还是失败，支付成功，路由跳转，支付失败，提示信息，因为要不断发所以可以用到定时器
      // 当定时器不存在的时候开启一个定时器 支付成功路由跳转到paysuccess
      if (!this.timer) {
        this.timer = setInterval(async () => {
          // 发请求获取用户支付状态 这个接口可以查询到用户支付订单的状态，是支付成功呢，还是支付中，还是支付失败
          let result = await this.$API.reqPayStatus(this.orderId)
          // 如果扫了二维码支付以后result.message就显示支付成功，没用支付就显示正在支付中
          if (result.code === 200) {
            //支付成功 清除定时器
            clearInterval(this.timer)
            this.timer = null
            // 保存支付成功的code
            this.code = result.code
            // 关闭弹框  最开始在main.js里面引入了两个 这个$msgbox.close()方法就是elementUI给我们封装的关闭弹出框的方法
            this.$msgbox.close()
            // 跳转到下一个路由
            this.$router.push('/paysuccess')
          }
        }, 2500)
      }
    }

  },
  computed: {
    orderId() {
      return this.$route.query.orderId
    }
  }
}
</script>

<style lang="less" scoped>
.pay-main {
  margin-bottom: 20px;

  .pay-container {
    margin: 0 auto;
    width: 1200px;

    a:hover {
      color: #4cb9fc;
    }

    .orange {
      color: #e1251b;
    }

    .money {
      font-size: 18px;
    }

    .zfb {
      color: #e1251b;
      font-weight: 700;
    }

    .checkout-tit {
      padding: 10px;

      .tit-txt {
        font-size: 14px;
        line-height: 21px;

        .success-icon {
          width: 30px;
          height: 30px;
          display: inline-block;
          background: url(./images/icon.png) no-repeat 0 0;
        }

        .success-info {
          padding: 0 8px;
          line-height: 30px;
          vertical-align: top;
        }
      }

      .paymark {
        overflow: hidden;
        line-height: 26px;
        text-indent: 38px;

        .fl {
          float: left;
        }

        .fr {
          float: right;

          .lead {
            margin-bottom: 18px;
            font-size: 15px;
            font-weight: 400;
            line-height: 22.5px;
          }
        }
      }
    }

    .checkout-info {
      padding-left: 25px;
      padding-bottom: 15px;
      margin-bottom: 10px;
      border: 2px solid #e1251b;

      h4 {
        margin: 9px 0;
        font-size: 14px;
        line-height: 21px;
        color: #e1251b;
      }

      ol {
        padding-left: 25px;
        list-style-type: decimal;
        line-height: 24px;
        font-size: 14px;
      }

      ul {
        padding-left: 25px;
        list-style-type: disc;
        line-height: 24px;
        font-size: 14px;
      }
    }

    .checkout-steps {
      border: 1px solid #ddd;
      padding: 25px;

      .hr {
        height: 1px;
        background-color: #ddd;
      }

      .step-tit {
        line-height: 36px;
        margin: 15px 0;
      }

      .step-cont {
        margin: 0 10px 12px 20px;

        ul {
          font-size: 0;

          li {
            margin: 2px;
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid #ddd;
            cursor: pointer;
            line-height: 18px;
          }
        }
      }
    }

    .submit {
      text-align: center;

      .btn {
        display: inline-block;
        padding: 15px 45px;
        margin: 15px 0 10px;
        font: 18px "微软雅黑";
        font-weight: 700;
        border-radius: 0;
        background-color: #e1251b;
        border: 1px solid #e1251b;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }
    }
  }
}
</style>