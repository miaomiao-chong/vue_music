<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
  import useScroll from './use-scroll'
  import { ref } from 'vue'
  export default {
    name: 'Scroll',
    props: {
      click: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      const rootRef = ref(null)
      // 传递一个容器，一个配置参数props
      useScroll(rootRef, props)
      return {
        rootRef
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>