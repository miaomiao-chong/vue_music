import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onMounted, ref, onUnmounted } from 'vue'

// 注册插件
BScroll.use(Slide)
// 传入一个ref对象
export default function useSlider(wrapperRef) {
  // 为什么要定义在外部呢 因为最后要把slider return出去
  const slider = ref(null)
  const currentPageIndex = ref(0)

  onMounted(() => {
    // wrapperRef.value:对应wrapperRef容器的dom对象
    slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })
    slider.value.on('slideWillChange', (page) => {
      // 因为定义的是ref对象，所以一定要写.value
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slider.value.destroy()
  })
  return {
    slider,
    currentPageIndex
  }
}
