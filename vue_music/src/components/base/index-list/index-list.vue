<template>
  <Scroll class="index-list">
    <div>
      <div class="group-list" v-for="group in list" :key="group.name">
        <div class="title">{{group.title}}</div>
        <div class="listItem" v-for="item in group.list" :key="item.name" >
          <img v-lazy="item.picUrl" alt="" srcset="">
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </div>
  </Scroll>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";
export default {
  components: { Scroll },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    console.log("index-list", this.list);
  }
};
</script>

<style lang="scss" scoped>
.index-list{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .group-list{
    .title{
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      background-color: rgba(145, 137, 137, 0.938);
      color:rgb(192, 189, 189);
      padding-left: 7px;
    }
    .listItem{
      height: 80px;
      display: flex;
      align-items: center;
      // justify-content: center;
      .name{
        color:rgb(192, 189, 189);
      }
      img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 15px;
      }
    }
  }
}
</style>