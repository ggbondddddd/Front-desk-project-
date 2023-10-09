let myPlugins = {}
// vue.use（）小括号里面第一个参数是自定义插件名 第二个参数可以是个对象 就是传入到myPlugins.install里面的options形参的属性值
//myPlugins.install 第一个参数默认是vue  第二个参数是vue.use（）小括号传进来的第二个参数，可以是个对象
myPlugins.install = function (Vue, options) {
    // 由于里面由vue，所有可以用vue上面的很多方法比如  Vue.prototype.$bus， Vue.directive，Vue.component，Vue.filter ......
    Vue.directive(options.name, function (element, params) {
        //在组件中使用方式 <h1 v-upper="msg"></h1>   其中msg是data传进来的参数 
        //options.name是全局指令名 在组件中使用方法是v-全局组件名  element就是你这个事件绑定在了那个元素
        // params打印出来{name: 'upper', rawName: 'v-upper', value: 'abc', expression: 'msg', modifiers: {…}, …} 
        element.innerHTML = params.value.toUpperCase()
    })
}
// 这个全局插件的作用就是自定义一个自定义指令 v-upper 由这个例子可以知道懒加载插件的原理就是在内部定义一个全局指令v-lazy
export default myPlugins