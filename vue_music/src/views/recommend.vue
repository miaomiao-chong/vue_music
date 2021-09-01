<template>
  <div>
    推荐页面
  </div>
</template>

<script>
  import { getBanner } from '@/service/banner'
  export default {
    name: 'recommend',
    async created() {
      const result = await getBanner()
      console.log(result)
    }
  }
</script>

<style lang="scss" scoped>

</style>
