import { createStore } from 'vuex'
import { FAVORITE_KEY, PLAY_KEY, PLAY_MODE, SEARCH_KEY } from "@/assets/js/constant";
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
    likeList: JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [],
    searchHistory: JSON.parse(localStorage.getItem(SEARCH_KEY)) || [],
    playHistory: JSON.parse(localStorage.getItem(PLAY_KEY)) || []
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
    },
    setSearchHistory(state, list) {
      state.searchHistory = list
    },
    setPlayHistory(state, songs) {
      state.playHistory = songs
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
    },
    removeSong({ commit, state }, song) {
      const sequenceList = state.sequenceList.slice()
      const playlist = state.playlist.slice()

      const sequenceIndex = getIndex(sequenceList, song)
      const playlistIndex = getIndex(playlist, song)
      if (playlistIndex < 0 || sequenceList < 0) {
        // 做一层保护，currentIndex就不会被修改成奇怪的值
        return
      }
      sequenceList.splice(sequenceIndex, 1)
      playlist.splice(playlistIndex, 1)
      // 解决删除歌曲bug
      let currentIndex = state.currentIndex
      if (playlistIndex < currentIndex || currentIndex === playlist.length) {
        currentIndex--
      }

      commit('setSequenceList', sequenceList)
      commit('setPlaylist', playlist)
      commit('setCurrentIndex', currentIndex)
      console.log("this", this)
      if (!playlist.length) {
        commit('setPlayingState', false)
      }

      function getIndex(list, song) {
        return list.findIndex((item) => {
          return item.id === song.id
        })
      }
    },
    // 清空菜单按钮里的播放列表
    clearSongList({ commit }) {
      commit('setSequenceList', [])
      commit('setPlaylist', [])
      commit('setCurrentIndex', 0)
      commit('setPlayingState', false)
    },
    addSong({ commit, state }, song) {
      console.log(song)
      const playlist = state.playlist.slice()
      const sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex
      // 是否已经存在在列表里 如果已经有了就直接修改currentIndex就好
      const hasSong = playlist.findIndex((item) => {
        return item.id === song.id
      })
      console.log(hasSong)
      // 没有找到
      if (hasSong === -1) {
        console.log("没有找到")
        playlist.push(song)
        // 最后一首歌，即本次添加的一首歌，让他立即播放
        currentIndex = playlist.length - 1
      } else {
        //  已经存在列表中
        console.log("已经存在列表中")
        currentIndex = hasSong
      }
      //  原始播放列表也需要添加歌曲
      const hasSong2 = sequenceList.findIndex((item) => {
        return item.id === song.id
      })
      if (hasSong2 === -1) {
        sequenceList.push(song)
      }
      // 提交mutation
      commit('setSequenceList', sequenceList)
      commit('setPlaylist', playlist)
      commit('setPlayingState', true)
      commit('setCurrentIndex', currentIndex)
      commit('setFullScreen', true)
    }
  },
  modules: {}
})
