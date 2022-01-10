<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li v-for="item in list" :key="item.id" class="list">
        <span class="searchItem" @click="$emit('clickSearchHistory', item)">{{item}}</span>
        <span class="delete" @click="deleteSearchHistory(item)">X</span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "search-list",
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    deleteSearchHistory(item) {
      this.$emit("deleteSearchHistory", item)
    }
  }
}
</script>

<style scoped lang="scss">
.search-list{

  .list{
    width: 100%;
    display: flex;
    height: 30px;
    line-height: 30px;
    line-height: 30px;
    color: #6f6f6c;
    .searchItem{
      flex: 1;
      display: inline-block;
      margin-right: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

    }
    .delete{
      width: 40px;
      text-align: center;
      display: inline-block;
    }
  }
}
</style>
