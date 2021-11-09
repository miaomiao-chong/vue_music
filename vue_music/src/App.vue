<template>
  <m-header></m-header>
  <m-tab></m-tab>
  <router-view :style="viewStyle"></router-view>
  <m-player></m-player>
</template>

<script>
// import Header from '@/components/header/header'
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import player from '@/components/player/player'
import { mapState } from 'vuex'

export default {
  components: {
    MHeader: Header,
    MTab: Tab,
    MPlayer: player
  },
  computed: {
    viewStyle() {
      const bottom = this.playlist.length ? '60px' : ''
      return {
        bottom
      }
    },
    ...mapState([
      'playlist'
    ])
  }
}
</script>
<style lang="scss" scoped>
</style>
