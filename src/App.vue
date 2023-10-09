<template>
  <div>
    <!-- <el-button type="success">主要按钮</el-button> -->
    <!-- <h1 v-upper="msg" ></h1> -->
    <!-- 静态组件 -->
    <Header />
    <!-- 路由组件的使用  路由就相当于是动态组件-->
    <router-view></router-view>
    <!-- 在Home和Search显示，在登录，注册隐藏   静态组件-->
    <Footer v-show="$route.meta.show" />
  </div>
</template>

<script>
import Header from "./components/Header/index.vue";
import Footer from "./components/Footer/index.vue";
export default {
  name: "App",
  data() {
    return {
      msg: "abc",
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    // 通知vuex发请求，获取数据，存储于仓库当中 放在app.vue里面的好处 不会出现 每次切换组件然后每次触发发起一次请求的情况 现在就只需要发一次请求
    this.$store.dispatch("home/categoryList");
  },
};
</script>

<style scoped lang="less"></style>
