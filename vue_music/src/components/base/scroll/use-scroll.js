import BScroll from '@better-scroll/core'
import { ObserveDom } from 'better-scroll'
import { onMounted, ref, onUnmounted, onActivated, onDeactivated } from 'vue'

BScroll.use(ObserveDom)
export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)
  onMounted(() => {
    // debugger
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
    if (options.probeType > 0) {
      scroll.value.on('scroll', (pos) => {
        // console.log(pos);
        // 把位置信息派发出去
        emit('scroll', pos)
      })
    }
  })
  onUnmounted(() => {
    scroll.value.destroy()
  })
  // keep-alive增加代码
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })
  onDeactivated(() => {
    // 禁用
    scroll.value.disable()
  })

  return scroll
}
