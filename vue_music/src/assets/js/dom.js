// 传入一个dom对象
export function addClass(el, className) {
  // 不希望它重复的添加
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass(el, className) {
  el.classList.remove(className)
}