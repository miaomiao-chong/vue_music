<template>
  <div>
    <div class="recommend">
      <div class="slider-wrapper">
        <div class="slider-content">
          <slider v-if="sliders.length" :sliders="sliders"></slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getBanner, getPlaylist } from '@/service/recommend'
  import Slider from '@/components/base/slider/slider'
  export default {
    name: 'recommend',
    components: {
      Slider
    },
    data() {
      return {
        sliders: [],
        albums: []
      }
    },
    async created() {
      const result = await getBanner()
      // console.log(result)
      this.sliders = result.data.result.sliders
      console.log('sliders', this.sliders.length)

      const playlist = await getPlaylist()
      // console.log("play", playlist)
      this.albums = playlist
    }
}
</script>

<style lang="scss" scoped>
 .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: scroll;
      .slider-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 40%;
        overflow: hidden;
        .slider-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
  }
</style>
