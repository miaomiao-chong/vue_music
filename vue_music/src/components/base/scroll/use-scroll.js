import BScroll from '@better-scroll/core'
import { ObserveDom } from '_better-scroll@2.4.2@better-scroll'
import { onMounted, ref, onUnmounted } from '_vue@3.2.6@vue'

BScroll.use(ObserveDom)
export default function useScroll(wrapperRef, options) {
  const scroll = ref(null)

  onMounted(() => {
    // debugger
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })

  onUnmounted(() => {
    scroll.value.destory()
  })
}
