<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import useScroll from "./use-scroll";
import { ref } from "vue";

export default {
  name: "Scroll",
  props: {
    click: {
      type: Boolean,
      default: true,
    },
    probeType: {
      type: Number,
      dafault: 0,
    },
  },
  // 组件会派发的自定义事件
  emits: ["scroll"],
  setup(props, { emit }) {
    const rootRef = ref(null);
    // 传递一个容器，一个配置参数props
    const scroll = useScroll(rootRef, props, emit);
    return {
      rootRef,
      scroll
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
