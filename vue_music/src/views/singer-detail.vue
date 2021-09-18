<template>
  <div class="singer-container">
    <!-- <div class="aaa">我是跳转后的页面</div> -->
  </div>
</template>

<script>
import { getSingerDetail } from "@/service/singer";
export default {
  name: "singer-detail",
  props: {
    singer: Object,
  },
  async created() {
    let result = await getSingerDetail(this.singer);
    result = result.data.result;
    console.log("singer-detail", result);
  },
};
</script>

<style lang="scss" scoped>
.singer-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgb(68, 66, 66);
}
</style>