<template>
  <div>
    <!-- 商品分类三级列表 -->
    <TypeNav />

    <div class="main">
      <div class="py-container">
        <!--bread 面包屑，带有x的结构的-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i
                @click="removeCategoryName">x</i></li>
            <!-- 关键字的面包屑 这里是从三级分类路由传过来的params里面的参数-->
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyword">x</i></li>
            <!-- 品牌图片那个面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(':')[1] }}<i
                @click="removeTrademark">x</i>
            </li>
            <!-- 平台的售卖属性值展示  这里不能用v-if了 因为这里可能对显示多个-->
            <li class="with-x" v-for="(attrValue, index) in searchParams.props" :key="index">{{ attrValue.split(':')[1]
            }}<i @click="removeAttr(index)">x</i>
            </li>

          </ul>
        </div>

        <!--面包屑下面，综合与价格上面那个选择配置的地方-->
        <!-- 此处两个自定义事件为了知道你在这个组件里面点击的是那一个地方 -->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序的结构-->
              <ul class="sui-nav">
                <!-- active是属性选择器 后面是判断这个属性是否存在 有1 就存在这个属性 includes方法返回布尔值  类似于：class="{active：true}"-->
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <!-- 这里的上下箭头图标用了阿里图标库 -->
                  <a>综合<span v-show="isOne"
                      :class="{ 'iconfont icon-up': isAsc, 'iconfont icon-down': !isAsc }"></span></a>
                </li>
                <li :class="{ active: !isOne }" @click="changeOrder('2')">
                  <a>价格<span v-show="!isOne"
                      :class="{ 'iconfont icon-up': isAsc, 'iconfont icon-down': !isAsc }"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销量产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(good, index) in goodList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">

                    <!-- 在路由跳转的时候不能忘记带id（params）参数 这里这个参数就是为了给detail在请求数据时其中一个形参 因为detail获取数据你要知道获取
                    的时那一个对应的数据 每一个的id都不同-->
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>

                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{ good.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- 分页器：测试分页器阶段，这里数据将来需要替换的 continues连续页数规定最好是奇数 -->
          <!-- 此处这个自定义事件就是分页器的关键 接收传过来现在的当前页数 -->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="searchList.total"
            :continues="5" @getPageNo="getPageNo" />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector"
import { mapState, mapGetters } from "vuex"
export default {
  name: "Search",
  components: { SearchSelector },
  data() {
    return {
      // 带给服务器参数
      searchParams: {
        // 一级分类的id
        category1Id: "",
        // 二级分类的id
        category2Id: "",
        // 三级分类的id
        category3Id: "",
        // 分类名字
        categoryName: "",
        // 关键字
        keyword: "",
        // 排序
        order: "1:desc",
        // 分页器用的:代表的是当前是第几页
        pageNo: 1,
        // 代表的是每一个展示数据个数
        pageSize: 3,
        // 平台售卖属性操作带的参数
        props: [],
        // 品牌
        trademark: "",
      },
    }
  },
  // 当组件挂载完毕之前执行一次（先于mounted之前）
  beforeMount() {
    // this.searchParams.category1Id=this.$route.query.category1Id 下面就是把一系列这种合并
    // Object.assign()：es6新增语法 合并对象 比如 query={a:'6'} params={b:'8'} to={a:'',b:''} object.assign(to,query,params) 结果to={a:'6',b:'8'}
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },
  mounted() {
    // 在发请求之前带给服务器参数（searchParams参数发生变化有数值带给服务器）
    this.getData()
  },
  computed: {
    ...mapGetters("search", ["goodList"]),
    isOne() {
      return this.searchParams.order.includes('1')
    },
    isAsc() {
      return this.searchParams.order.includes('asc')
    },
    // 获取search模块展示产品一共多少数据
    ...mapState('search', ['searchList'])

  },
  methods: {
    // 向服务器发请求获取search模块数据（根据参数不同返回不同的数据进行展示）
    // 把这次请求封装为一个函数：当你需要在调用的时候调用即可
    getData() {
      // 不管是query和params参数变化都会引起调用这个函数 query是在三级分类里面 params是在header也就是搜索栏里面
      this.$store.dispatch("search/getSearchList", this.searchParams)
    },
    // 删除分类的名字   三级分类里面得到的query值
    removeCategoryName() {
      // 把带给服务器的参数置空，那么面包屑就会消失 
      // 这里很重要的点 带给服务器的参数 空就是可有可无的 那么大可直接undefined 这样传给服务器的参数就会少几个 节约宽带 省流
      this.searchParams.categoryName = undefined
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      // 然后再从新向服务器发送请求 刷新页面
      // this.getData()
      // 地址栏跳转也需要改:进行路由跳转 这样其实是有问题的 并且问题很大 因为跳转路由的时候 下面的watch监听里面会调用一次 其实不应该这样写
      // 这里本意删除query的数据 路径中的params参数不受影响
      // 这里可以不写这个if判断直接写里面的内容 因为params永远为真 为什么 因为params里面没用数据的时候为空 空对象也为真
      // if (this.$route.params) {
      this.$router.push({ name: 'search', params: this.$route.params })
    },
    // 删除关键字    关键字是搜索框里面输入的这个params值
    removeKeyword() {
      // 给服务器带的参数searchParams的keyword置空
      this.searchParams.keyword = undefined
      // 再次发请求
      // this.getData()
      // 通知兄弟组件Header清除关键字 也就是清空搜索栏里面的内容
      this.$bus.$emit('clear')
      // 进行路由跳转
      this.$router.push({ name: 'search', query: this.$route.query })
    },
    // 自定义事件的回调
    trademarkInfo(trademark) {
      // 首先整理参数  'ID：品牌名称'
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      // 虽然参数变化了 下面还要从新发请求 进行展示
      this.getData()
    },
    // 删除品牌的信息
    removeTrademark() {
      // 将品牌信息置空
      this.searchParams.trademark = undefined
      // 再次发请求
      this.getData()
    },
    // 收集平台属性的回调
    attrInfo(attr, attrValue) {
      // ['属性ID:属性值：属性名']
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
      // 数组去重 运用indexOf()方法 用include方法也可以
      if (this.searchParams.props.indexOf(props) === -1) {
        this.searchParams.props.push(props)
        // 再次发请求
        this.getData()
      }
    },
    // 删除售卖属性
    removeAttr(index) {
      this.searchParams.props.splice(index, 1)
      // 再次发请求
      this.getData()
    },
    // 排序的操作 这里操作就是
    changeOrder(flag) {
      //  flag形参：是一个标记，代表用户点击的是什么 1就是综合 2就是价格 
      // // let originOrder = this.searchParams.order
      // // 获取最开始的状态
      let originFlag = this.searchParams.order.split(':')[0]
      let originSort = this.searchParams.order.split(':')[1]
      // 准备一个新的order属性值
      let newOrder = ''
      // 连续点击综合或者价格的时候 这个时候前面不变后面的图标上升还是下降变
      if (flag === originFlag) {
        newOrder = `${originFlag}:${originSort.includes('desc') ? 'asc' : 'desc'}`
      }
      // 从综合点击到价格或从价格点击到综合时候
      else {
        newOrder = `${flag}:${'desc'}`
      }
      // 将新的order赋给searchParams
      this.searchParams.order = newOrder
      this.getData()
    },
    //分页器 自定义事件的回调函数 获取当前是第几页
    getPageNo(pageNo) {
      // 整理从分页器子组件获得的目前体点击页数的参数
      if (this.searchParams.pageNo !== pageNo) {
        console.log(pageNo)
        this.searchParams.pageNo = pageNo
        // 再次发送请求
        this.getData()
      }
    }
  },
  // 数据监听：监听组件实例身上的属性的属性值变化 深度监听开启条件 比如 一个数组里面有一个对象 要检测这个对象里面属性的变化就要深度监视 
  watch: {
    // 这里为什么不是写this.$route，我的理解是监听别的属性的时候也没用写this 所以这个也不用写把
    // 没写handler 就是简写写法 handler就可以写其他配置项目 
    $route(newValue, oldValue) {
      console.log(111)
      //  再次发请求之前整理带给服务器的参数 因为上次整理参数只是在beforeMount整理过
      Object.assign(this.searchParams, this.$route.query, this.$route.params)
      // 再次发起ajax请求
      this.getData()
      // 每一次请求完毕，应该把相应的1，2，3级分类的id清除，让他接收下一次的相应的1，2，3级分类id 比如点了一个一级 然后点了个二级 上次那个一级分类的id应该清除
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
    }
  }

}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
