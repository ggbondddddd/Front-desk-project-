<template>
  <div class="swiper-container" id="floor1Swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="carousel in list" :key="carousel.id">
        <!-- 这里一样的 src要加冒号 这样才能解析后面的表达式 -->
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>
    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
// 引入swiper
import Swiper from "swiper";
export default {
  name: "Carousel",
  props: ["list"],
  mounted() {
    // 运行顺序 先从home通过props获取了数据 然后home组件里面的floor组件v-for循环，再接着创建floor组件 ，最后执行floor组件里面的mounted
    // 在此处mounted之前 需要的数据已经传进来了 而第一次书写轮播图时，是在当前组件内部发请求，动态渲染结构（前台至少服务器数据需要回来）
    // swiper在mounted的时候数据还没有传进来 所以要用watch配合nextTick书写 ，所以当年的那个轮播图swiper在这里不行 必须用watch
    // 现在这种写法可以:因为请求时父组件发的，父组件通过props传递过来数据，再mounted挂载之前结构也已经有了
    // var mySwiper = new Swiper('.swiper-container', {
    //     // direction: 'vertical', // 垂直切换选项
    //     loop: true, // 循环模式选项
    //     // 如果需要分页器
    //     pagination: {
    //         el: '.swiper-pagination',
    //         clickable: true
    //     },
    //     // 如果需要前进后退按钮
    //     navigation: {
    //         nextEl: '.swiper-button-next',
    //         prevEl: '.swiper-button-prev',
    //     },
    //     // 如果需要滚动条
    //     scrollbar: {
    //         el: '.swiper-scrollbar',
    //     },
    // })
  },
  watch: {
    // 为了代码风格一样 所以也放在watch里面
    list: {
      // 限制watch不能直接到list变化：因为这个数据不像之前从没用变为有，现在数据是父组件给的，一直都存在，父亲给的时候是一个对象
      // 不管数据有没用发生变化，程序运行立刻监听一次 ，所以需要这个属性执行以下list里面的函数
      immediate: true,
      handler() {
        this.$nextTick(() => {
          var mySwiper = new Swiper(".swiper-container", {
            // direction: 'vertical', // 垂直切换选项
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },

            // 如果需要滚动条
            scrollbar: {
              el: ".swiper-scrollbar",
            },
          });
        });
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
