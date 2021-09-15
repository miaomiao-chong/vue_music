<template>
  <Scroll class="index-list" :probe-type="3" @scroll="onScroll">
    <div ref="groupRef" class="aaa">
      <div class="group-list" v-for="group in list" :key="group.name">
        <div class="title">{{ group.title }}</div>
        <div class="listItem" v-for="item in group.list" :key="item.name">
          <img v-lazy="item.picUrl" alt="" srcset="" />
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="fixed">
      <div class="fixed-title">
        <!-- {{ fixedTitle }} -->
      </div>
    </div>
  </Scroll>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";
import useFixed from "./use-fixed";
let scrollY = 0;
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
  // setup(props) {
  //   const { groupRef } = useFixed(props);
  //   return {
  //     groupRef,
  //   };
  // },

  watch: {
    list: function () {
      this.$nextTick(() => {
        const children = this.$refs.groupRef.children;
        console.log(children);
        const heightArr = [];
        let height = 0;
        for (let i = 0; i < children.length; i++) {
          height += children[i].clientHeight;
          // console.log(height);
          heightArr.push(height);
        }
        console.log(heightArr);
      });
    },
  },
  methods: {
    onScroll(val) {
      // console.log(scrollY);
      scrollY=-val
    },
  },
};
</script>

<style lang="scss" scoped>
.index-list {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .group-list {
    .title {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      background-color: rgba(145, 137, 137, 0.938);
      color: rgb(90, 90, 90);
      padding-left: 7px;
    }
    .listItem {
      height: 80px;
      display: flex;
      align-items: center;
      // justify-content: center;
      .name {
        color: rgb(192, 189, 189);
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 15px;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    background: rgb(145, 137, 137);
    color: rgb(90, 90, 90);
    .fixed-title {
      padding-left: 7px;
      line-height: 30px;
    }
  }
}
</style>