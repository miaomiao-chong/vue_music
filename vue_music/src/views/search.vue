<template>
  <div style="width: 70%">
    <search-input placeholder="placeholder" v-model="query"></search-input>
  </div>
</template>

<script>
import searchInput from '@/components/search/search-input'

export default {
  name: '',
  components: {
    'search-input': searchInput
  },
  data() {
    return {
      placeholder: '输入查询的歌手/歌曲',
      query: ''
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
