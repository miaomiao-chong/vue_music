import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy' // new
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'
import '@/assets/scss/index.scss'
import '@/assets/scss/mixin.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(store).use(router).use(ElementPlus).use(lazyPlugin, {
  loading: require('@/assets/images/loading.png') // new
}).directive('loading', loadingDirective).directive('no-result', noResultDirective).mount('#app')
