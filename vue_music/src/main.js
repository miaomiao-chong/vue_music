import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy' // new
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'
import '@/assets/scss/index.scss'

createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/loading.png') // new
}).directive('loading', loadingDirective).directive('no-result', noResultDirective).mount('#app')
