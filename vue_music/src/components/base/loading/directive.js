// import Loading from './loading'
// import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive.js'
// const loadingDirective = createLoadingLikeDirective(Loading)
// export default loadingDirective

// 指令对象 把loading组件生成的dom动态
// 插入到指令作用的dom上

// 判断loading值，为true的话动态插入到作用的节点上，
// 如何创建组件对应的dom呢  可以新建一个vue实例，
// 创建一个新的app对象，然后动态挂载然后产生一个实例，
// 在实例里面就可以拿到dom了，
import { createApp } from 'vue'
import Loading from './loading'
const loadingDirective = {
  // 挂载的时候执行
  mounted(el, binding) {
    // app对象的根组件就是loading组件
    const app = createApp(Loading)
    // 通过app.mount方法拿到他的实例
    // 可以动态在里面创建一个div对象
    // vue开发实际上是支持多实例的，并不是说只能在入口里里面创建一个实例，
    const instance = app.mount(document.createElement('div'))
    el.instance = instance
    if (binding.value) {
      append(el)
    }
  },
  // 组件更新时执行
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}
function append(el) {
  // 执行挂载
  el.appendChild(el.instance.$el)
}
function remove(el) {
  // 移除
  el.removeChild(el.instance.$el)
}
export default loadingDirective
