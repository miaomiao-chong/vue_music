<template>
  <div class="music-list">
    
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      title: String,
      pic: String
    }
  }
</script>

<style lang="scss" scoped>

</style>