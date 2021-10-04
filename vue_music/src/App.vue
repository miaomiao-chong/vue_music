<template>
    <m-header></m-header>
    <m-tab></m-tab>
    <router-view></router-view>
    <m-player></m-player>
</template>

<script>
// import Header from '@/components/header/header'
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import player from '@/components/player/player'
export default {
  components: {
    MHeader: Header,
    MTab: Tab,
    MPlayer: player
  }
}
</script>
<style lang="scss" scoped>
</style>
