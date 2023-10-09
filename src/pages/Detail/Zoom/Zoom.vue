<template>
  <div class="spec-preview">
    <!-- 这是需要被放大的图片 -->
    <img :src="imgObj.imgUrl" />
    <!-- 这里是放鼠标移动事件的地方 -->
    <!-- 这里可以用这个div来拿到需要放大图片的坐标的原因是这个标签继承了这个放大镜div的100%宽度和高度 -->
    <div class="event" @mousemove="handler"></div>
    <!-- 这里面是放大出来的图片 -->
    <div class="big">
      <img :src="imgObj.imgUrl" ref="bigBox" />
    </div>
    <!-- 遮罩层  原本是display:none 不知道为什么 设置的高度宽度就显现了-->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Zoom",

  data() {
    return {
      currentIndex: 0,
    };
  },
  props: ["skuImageList"],
  mounted() {
    // 全局事件总线，获取兄弟组件ImageList里面点击的那张图片的索引值
    this.$bus.$on("choiceIndex", (index) => {
      this.currentIndex = index;
    });
  },
  computed: {
    // ...mapGetters('detail', ['skuInfo']),
    imgObj() {
      // return this.skuInfo.skuImageList[this.currentIndex] || {}
      // 把从imagelist得到的index赋值给data里面的currentindex 然后拿到这个index 就可以让放大镜展示这个图片数组里面对应索引值的图片 默认展示下标为0的图片
      return this.skuImageList[this.currentIndex] || {};
    },
  },
  methods: {
    // 这个e可以不写 默认传入参数就是e 写event也行
    handler(e) {
      // 这一步相当于给获取这个属性 相当于原生js里面的add.queryselect（）
      let mask = this.$refs.mask;
      let bigBox = this.$refs.bigBox;
      //  offsetX是鼠标距离e元素边框的距离，这个e就是放大镜这个一整个结构，最大是400  mask.offsetWidth是这个遮罩层盒子的宽度200
      // 这个x的意思是 当鼠标在要放大图片里面移动100px以后遮罩层开始移动 移动遮罩层的一半开始移动 而不是立马移动
      // 最终 当x到了遮罩层的距离 也就是200的时候 x停止移动 这个和那个类似

      // let x = e.offsetX - mask.offsetWidth / 2
      // let y = e.offsetY - mask.offsetHeight / 2
      // // 约束范围
      // if (x <= 0) x = 0
      // // 300到400px的时候x就等于200px
      // if (x >= mask.offsetWidth) x = mask.offsetWidth
      // if (y <= 0) y = 0
      // if (y >= mask.offsetHeight) y = mask.offsetHeight

      // 这里的x是当前e在自己放大镜里面的坐标 不带px
      let x = e.offsetX;
      console.log(x);
      let y = e.offsetY;
      // 此处是判断遮罩层移动多少px
      if (x <= 100) {
        x = 0;
      } else if (100 < x && x < mask.offsetWidth + 100) {
        x = x - 100;
      } else {
        x = 200;
      }
      if (y <= 100) {
        y = 0;
      } else if (100 < y && y < mask.offsetHeight + 100) {
        y = y - 100;
      } else {
        y = 200;
      }
      mask.style.left = x + "px";
      mask.style.top = y + "px";
      bigBox.style.left = -2 * x + "px";
      bigBox.style.top = -2 * y + "px";
    },
  },
};
</script>

<style lang="less" scoped>
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 1, 1, 0.2);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>
