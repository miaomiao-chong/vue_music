import { FAVORITE_KEY, PLAY_KEY, PLAY_MODE, SEARCH_KEY } from "@/assets/js/constant";
export default {
  // 播放列表原始数据
  sequenceList: [],
  // 歌曲列表长度，用处：上一曲下一曲
  songListLen: 0,
  // 因为有播放模式 这个是实际播放列表
  playlist: [],
  // 是否正在播放
  playing: false,
  // 有三种模式 放到常量里面
  playMode: PLAY_MODE.sequence,
  // 当前歌曲索引
  currentIndex: 0,
  // 全屏的还是收缩的
  fullScreen: false,
  likeList: JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [],
  searchHistory: JSON.parse(localStorage.getItem(SEARCH_KEY)) || [],
  playHistory: JSON.parse(localStorage.getItem(PLAY_KEY)) || []
}