<template>
<!--  注意阻止冒泡-->
  <div class="progressContainer" @click.stop="handleIsplay">
    <el-progress type="circle" :percentage="percentage" color="yellow" :width=38 :strokeWidth=2
                 :showText="false" ></el-progress>
    <i v-if="!isPlay" class="iconfont icon-24gl-play playIcon"></i>
    <i v-else class="iconfont icon-24gl-pause playIcon"></i>
  </div>

</template>

<script>
export default {
  name: "progress",
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isPlay() {
      return this.$store.state.playing
    }
  },
  methods: {
    handleIsplay() {
      this.$store.commit('setPlayingState', !this.isPlay)
    }
  }
}
</script>

<style scoped lang="scss">
.progressContainer {
  position: relative;
  display: flex;

  .playIcon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

}
</style>
