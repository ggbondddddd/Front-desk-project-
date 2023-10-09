<template>
    <div>
        <!-- 使用三级联动全局组件 -->
        <TypeNav />
        <ListContainer />
        <Recommend />
        <Rank />
        <Like />
        <!-- 必须有key 不然会报错 由于floorlist里面数组里面有两个元素 所以生成两个Floor -->
        <Floor v-for="(floor, index) in floorList" :key="floor.id" :list="floor" />
        <Brand />

        <!-- <button @click="add">点击我加一</button>
        <span>仓库的数据{{ count }}</span>
        <button>点击我减一</button> -->
    </div>
</template>

<script>
import ListContainer from '@/pages/Home/ListContainer/index.vue'
import Recommend from '@/pages/Home/Recommend'
import Rank from '@/pages/Home/Rank'
import Like from '@/pages/Home/Like'
import Floor from '@/pages/Home/Floor'
import Brand from '@/pages/Home/Brand'
import { mapState } from 'vuex'


// import { mapMutations, mapState } from 'vuex'
export default {
    name: 'Index',
    components: { ListContainer, Recommend, Rank, Like, Floor, Brand },
    mounted() {
        // 派发action，获取floor组件的数据
        this.$store.dispatch("home/getFloorList")
        // 获取来自用户登录的信息在首页展示
        // this.$store.dispatch('registerandlogin/getUserInfo')
    },
    computed: {
        ...mapState('home', ["floorList"])
    }


}
</script>

<style lang="less" scoped></style>