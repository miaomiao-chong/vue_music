<template>
  <ul v-for="(songItem, index) in songs" :key="songItem.id" class="song-list">
    <li class="item" :key="songItem.name" @click="selectItem(songItem, index)">
      <!-- 后期还要加上排行奖杯 -->
      <div class="rank" v-if="rank">
        <span :class="getRankCls(index)" class="ranClass">
          {{ getRankText(index) }}
        </span>
      </div>
      <div class="content">
        <h2 class="title">{{ songItem.name }}</h2>
        <p class="desc">{{ songItem.singer }}--{{ songItem.album }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "songList",
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    rank: Boolean
  },
  emits: ['select'],
  methods: {
    selectItem(songItem, index) {
      // 派发一个事件
      this.$emit('select', {
        songItem,
        index
      })
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  // width: 100%;
  .item {
    // width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: 8px;
    // font-size: $font-size-medium;
    .rank {
      height: 20px;
      width: 20px;
      margin-right: 20px;
      text-align: center;
      flex: 0 0 25px;

      .text {
        color: #dccc9c;
      }

      .icon {
        width: 25px;
        height: 24px;
        display: inline-block;
        background-size: 25px 24px;

        &.icon0 {
          background-image: url("https://img-blog.csdnimg.cn/afbafe8c9c95444380857650c7b2a80b.png");
        }

        &.icon1 {
          background-image: url("https://img-blog.csdnimg.cn/020180cc5f514d809aa4e2b25aee93ec.png");
        }

        &.icon2 {
          background-image: url("https://img-blog.csdnimg.cn/afbafe8c9c95444380857650c7b2a80b.png");
        }
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .title {
        @include no-wrap();
      }

      .desc {
        @include no-wrap();
        width: 100%;
        color: rgba(222, 223, 224, 0.959);
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }
  }
}
</style>
