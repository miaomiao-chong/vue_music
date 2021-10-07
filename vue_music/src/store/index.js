import { createStore } from 'vuex'
import { PLAY_MODE } from "@/assets/js/constant";
import { shuffle } from "@/assets/js/utils";

export default createStore({
  state: {
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
    likeList: []
  },
  getters: {
    currentSong(state) {
      return state.playlist[state.currentIndex] || {}
    },
  },
  mutations: {
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
    }
  },
  // actions:对多个mutations的封装
  actions: {
    // 第二个参数：一个是列表一个是索引
    selectPlay(state, {
      list,
      index
    }) {
      // commit 可以解构出来
      state.commit('setPlayMode', PLAY_MODE.sequence);
      state.commit('setSequenceList', list)
      // 修改播放暂停或开始
      state.commit('setPlayingState', true)
      state.commit('setFullScreen', true)
      // 先不考虑随机播放 传入顺序播放列表
      state.commit('setPlaylist', list)
      state.commit('setPlayListLen', list)
      state.commit('setCurrentIndex', index)
    },
    randomPlay(state, list) {
      // console.log(list)
      state.commit('setPlayMode', PLAY_MODE.random);
      state.commit('setSequenceList', list)
      // 修改播放暂停或开始
      state.commit('setPlayingState', true)
      state.commit('setFullScreen', true)
      state.commit('setPlaylist', shuffle(list))
      state.commit('setCurrentIndex', 0)
    },
    changeMode({
                 state,
                 commit,
                 getters
               }, mode) {
      // console.log("mode", mode)
      // console.log("state.mode", state.playMode)
      // console.log("state.sequenceList---------------", state.sequenceList)
      const currentId = getters.currentSong.id
      if (mode === PLAY_MODE.random) {
        console.log('state.sequenceList', state.sequenceList)
        commit('setPlaylist', shuffle(state.sequenceList))
      } else {
        commit('setPlaylist', state.sequenceList)
      }
      const index = state.playlist.findIndex((song) => {
        return song.id === currentId
      })
      commit('setCurrentIndex', index)
      commit('setPlayMode', mode)
    }
  },
  modules: {}
})
