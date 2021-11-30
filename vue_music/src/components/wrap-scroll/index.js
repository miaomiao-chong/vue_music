import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import scroll from "@/components/base/scroll/scroll";
import { useStore } from "vuex";

export default {
  name: 'wrap-scroll',
  props: scroll.props,
  emits: scroll.emits,
  // ctx可以理解为this 上下文实例，
  render(ctx) {
    // 可以理解为vue2的createElement和createComponent
    return h(scroll, mergeProps({ ref: "scrollRef" }, ctx.$props, {
      onScroll: (e) => {
        ctx.$emit('scroll', e)
      }
    }), {
      default: withCtx(() => {
        return [renderSlot(ctx.$slots, 'default')]
      })
    })
  },
  setup() {
    const scrollRef = ref(null)
    const store = useStore()
    const playlist = computed(() =>
      store.state.playlist
    )
    watch(playlist, async () => {
      // scrollRef.value.scroll :scroll对象
      await nextTick()
      scroll.value.refresh()
    });
    return {
      // return到模板中
      scrollRef,
      scroll
    }
  }
}
