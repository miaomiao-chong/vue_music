
export default {
  // 修改播放状态
  setPlayingState(state, playing) {
    state.playing = playing
    console.log(11)
  },
  // 顺序播放列表
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  // 设置播放列表
  setPlaylist(state, list) {
    state.playlist = list
  },
  // 列表长度
  setPlayListLen(state, list) {
    state.songListLen = list.length
  },
  // 设置播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setLikelist(state, likelist) {
    state.likeList = likelist
  },
  setSearchHistory(state, list) {
    state.searchHistory = list
  },
  setPlayHistory(state, songs) {
    state.playHistory = songs
  }
}