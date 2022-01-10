<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="visible=false">
            X
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲"></search-input>
        </div>
        <div class="search-result" v-show="query">
          <suggest :query="query"></suggest>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import SearchInput from "@/components/search/search-input";
import Suggest from "@/components/search/suggest";

export default {
  name: "add-song",
  components: {
    Suggest,
    SearchInput
  },
  data() {
    return {
      visible: true,
      query: ''
    }
  }
}
</script>

<style scoped lang="scss">
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background-color: #423f3f;

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: 15px;
      color: whitesmoke;
    }

    .close {
      position: absolute;
      top: 14px;
      right: 10px;
      //transform:translateY(16px);
    }
  }

  .search-input-wrapper {
    margin: 20px
  }
}
</style>
