<template>

  <div class="singer">

    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger" />
      </transition>

    </router-view>
    <index-list :list="singerList" @select="selectSinger"></index-list>
  </div>
</template>

<script>
import { getSingerList } from "@/service/singer";
import IndexList from "@/components/base/index-list/index-list";
import { SINGER_KEY } from "@/assets/js/constant";
export default {
  name: "singer",
  components: { IndexList },
  data() {
    return {
      singerList: [],
      selectedSinger: null,
    }
  },

  async created() {
    let result = await getSingerList();
    // console.log(result); // 这里的result太复杂了
    // getSingerList里面引用的get方法应该再改一下的 只用返回result就行了
    // 这里就还是.data.result来拿到数据
    result = result.data.result;
    // console.log(result);
    this.singerList = result;
  },
  methods: {
    selectSinger(item) {
      // console.log(item);
      this.selectedSinger = item;
      this.cacheSinger(item);
      // console.log(sessionStorage.getItem(SINGER_KEY));
      this.$router.push(`/singer/${item.id}`);
    },
    cacheSinger(singer) {
      const setSingerStr = JSON.stringify(singer);
      sessionStorage.setItem(SINGER_KEY, setSingerStr);
    },
  },
};
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0px;
  overflow: hidden;
}
</style>
