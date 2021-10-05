const { ref, watch, nextTick } = require('vue')
export default function useFixed(props) {
  console.log(123456);
  // console.log(props);
  const groupRef = ref(null)
  const listHeights = ref([])
  watch(() => props.data, async () => {
    // 手松开
    await nextTick()
    calculate()
  })
  // 求解列表高度，
  function calculate() {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0
    listHeightsVal.length = 0
    listHeightsVal.push(height)
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
    // console.log(listHeightsVal);
  }
  return {
    groupRef
  }
}
