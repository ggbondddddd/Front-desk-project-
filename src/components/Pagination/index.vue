<template>
    <div class="pagination">
        <h1>{{ startNumAndEndNum }}--当前在{{ pageNo }}页</h1>
        <!-- 当前页是第一页的时候就点击不了这个button 当前页点击上一页就要页数减一 -->
        <button :disabled="pageNo === 1" @click="$emit('getPageNo', pageNo - 1)">上一页</button>
        <button v-if="startNumAndEndNum.start > 1" @click="$emit('getPageNo', 1)">1</button>
        <button v-if="startNumAndEndNum.start > 2">···</button>

        <!-- 中间部分 -->
        <button v-for="(page, index) in startNumAndEndNum.end" :key="index" v-show="page >= startNumAndEndNum.start"
            @click="$emit('getPageNo', page)" :class="{ active: pageNo === page }">{{ page }}</button>

        <button v-if="startNumAndEndNum.end < totalPage - 1">···</button>
        <button v-if="startNumAndEndNum.end < totalPage" @click="$emit('getPageNo', totalPage)">{{ totalPage }}</button>
        <button :disabled="pageNo === totalPage" @click="$emit('getPageNo', pageNo + 1)">下一页</button>
        <button style="margin-left: 30px">共 {{ total }} 条</button>
    </div>
</template>

<script>
export default {
    name: "Pagination",
    props: ['pageNo', 'pageSize', 'total', 'continues'],
    computed: {
        // 总共多少页
        totalPage() {
            return Math.ceil(this.total / this.pageSize)
        },
        // 计算出连续的页码的起始数字和结束数字
        startNumAndEndNum() {
            // 先定义两个变量存储起来数字于结束数字
            let start = 0, end = 0
            // 连续页码数字5（就是总页数至少是五页），如果出现不正常现象（就是不够五页）
            // 不正常情况（总页数少于连续页码数）
            if (this.continues > this.totalPage) {
                start = 1
                end = this.totalPage
            }
            // 正常情况（连续页码数大于总页数 也就是当连续页码是5的时候总页数大于5）
            else {
                // 比如 当前处于第8页 连续页码5     6 7 8 9 10  start就是6 end就是10
                // 起始数字
                start = this.pageNo - parseInt(this.continues / 2)
                // 结束数字
                end = this.pageNo + parseInt(this.continues / 2)
                // 正常情况里面的特殊情况1 start小于1时
                if (start < 1) {
                    start = 1,
                        end = this.continues
                }
                // 正常情况里面的第二种特殊情况 end大于总页数时
                else if (end > this.totalPage) {
                    start = this.totalPage - this.continues + 1
                    end = this.totalPage
                }
            }
            return { start, end }
        }
    }
}
</script>

<style lang="less" scoped>
.pagination {
    text-align: center;

    button {
        margin: 0 5px;
        background-color: #f4f4f5;
        color: #606266;
        outline: none;
        border-radius: 2px;
        padding: 0 4px;
        vertical-align: top;
        display: inline-block;
        font-size: 13px;
        min-width: 35.5px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        box-sizing: border-box;
        text-align: center;
        border: 0;

        &[disabled] {
            color: #c0c4cc;
            cursor: not-allowed;
        }

        &.active {
            cursor: not-allowed;
            background-color: #409eff;
            color: #fff;
        }
    }
}
</style>