export function shuffle(source) {
  console.log("--------------source----------------", source)
  const arr = source.slice()
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = getRandomInt(i);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getRandomInt(max) {
  // [0,max]
  return Math.floor(Math.random() * (max + 1))
}

export function formatTime(interval) {
  // interval 向下取整
  interval = interval | 0
  // 不足两位的话就向前填充一个0
  let minute = ((interval / 60 | 0) + '')
  let second = ((interval % 60 | 0) + '')
  let len = minute.length
  for (; len < 2; len++) {
    minute = '0' + minute
  }
  len = second.length
  for (; len < 2; len++) {
    second = '0' + second
  }
  return `${minute}:${second}`
}

export function debounce(fn, delay = 500) {
  let timer = null
  // console.log(123)
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // fn函数在执行的时候，会把当前的this,arguments传进来
      // 返回的fn可能会有一些参数，还要把this传进来，如果用this的话那就不能
      // 用箭头函数了 只能用function形式了
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}
