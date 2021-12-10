<template>
  <div class="search-input">
    <i class="iconfont icon-sousou"></i>
    <input type="text" class="input-inner" :placeholder="placeholder" v-model="query">
    <i class="iconfont icon-cha"></i>
  </div>
</template>

<script>
export default {
  name: "search-input",
  props: {
    // vue2默认的props为value
    modelValue: String,
    placeholder: {
      type: String,
      default: '请输入要查询的内容'
    },
  },
  data() {
    return {
      query: this.modelValue
    }
  },
  watch: {
    query(newQuery) {
      this.$emit('update:modelValue', newQuery.trim())
    }
  }
}
</script>

<style scoped lang="scss">
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: #6f6f6c;
  border-radius: 6px;

  .icon-sousou {
    font-size: 24px;
    color: #bbbbb8;
  }

  .input-inner {
    flex: 1;
    background-color: #6f6f6c;
    color: white;
    outline: 0;
    border: 0;
    font-size: 14px;

    &::placeholder {
      color: #bbbbb8;
    }
  }

  .icon-cha {
    font-size: 16px;
  }
}
</style>
