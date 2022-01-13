<template>
  <div class="search-input">
    <i class="iconfont icon-sousou"></i>
    <input
      type="text"
      class="input-inner"
      :placeholder="placeholder"
      v-model="query"
    />
    <i class="iconfont icon-cha" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from "@/assets/js/utils";
// import { debounce } from 'throttle-debounce'

export default {
  name: "search-input",
  props: {
    // vue2默认的props为value
    modelValue: String,
    placeholder: {
      type: String,
      default: "请输入要查询的内容",
    },
  },
  data() {
    return {
      query: this.modelValue,
    };
  },
  created() {

    // console.log(this)
    // this.$watch('query', debounce(function (e) {
    //   console.log(e)
    // }, 200))
  },
  watch: {
    query: debounce(function (params) {
      // console.log(params);
      this.$emit("update:modelValue", params);
    }, 500),
    modelValue(newVal) {
      this.query = newVal;
    },
  },

  methods: {
    clear() {
      this.query = "";
    },
  },
};
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
