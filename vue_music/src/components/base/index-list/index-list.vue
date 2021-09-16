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
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed-title">
        {{ fixedTitle }}
      </div>
    </div>
  </Scroll>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";
const heightArr = [];
const TITLE_HEIGHT = 20;
// let currentIndex = 0;
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
  data() {
    return {
      scrollY: 0,
      currentIndex: 0,
      distance: 0,
    };
  },
  watch: {
    list() {
      this.$nextTick(() => {
        const children = this.$refs.groupRef.children;
        heightArr.push(0);
        console.log(children);

        let height = 0;
        for (let i = 0; i < children.length; i++) {
          height += children[i].clientHeight;
          // console.log(height);
          heightArr.push(height);
        }
        console.log(heightArr);
      });
    },
    // 监听滚动
    scrollY(val) {
      // console.log(val);
      // 判断滑动的y值哪个区间内
      for (let i = 0; i < heightArr.length - 1; i++) {
        const heightTop = heightArr[i];
        const heightBottom = heightArr[i + 1];
        // 落在这个区间内
        if (val >= heightTop && val <= heightBottom) {
          // 当前展示组的索引
          this.currentIndex = i;
          this.distance = heightBottom - val;
          // this.fixedTitle = this.list[currentIndex].title;
        }
      }
    },
  },
  computed: {
    fixedTitle() {
      console.log(this.currentIndex);
      console.log(this.scrollY);
      // console.log(this.list[currentIndex].title);
      if (this.scrollY < 0) {
        return "";
      }
      const currentGroupTitle =
        (this.list &&
          this.list[this.currentIndex] &&
          this.list[this.currentIndex].title) ||
        "";
      console.log(this.list);
      return currentGroupTitle;
    },
    fixedStyle() {
      // diff 偏移值
      // diff是个负值，因为是向上偏移
      const diff =
        this.distance > 0 && this.distance < TITLE_HEIGHT ? this.distance - TITLE_HEIGHT : 0;
      return `transform: translate3d(0,${diff}px,0)`;
    },
  },
  methods: {
    onScroll(val) {
      // console.log(val);
      this.scrollY = -val.y;
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
    // z-index: -1;
    .fixed-title {
      font-size:  12px;
      padding-left: 7px;
      line-height: 30px;
    }
  }
}
</style>