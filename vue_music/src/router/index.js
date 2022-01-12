import { createRouter, createWebHashHistory } from 'vue-router'
import Recommend from '@/views/recommend'
import Singer from '@/views/singer'
import Search from '@/views/search'
import TopList from '@/views/top-list'
import Album from '@/views/album'
import SingerDetail from '@/views/singer-detail'
import Player from '@/components/player/player'
import Test from '@/views/test'
import topDetail from '@/views/top-detail'
import UserCenter from '@/views/user-center'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/top-list',
    component: TopList,
    children: [{
      path: ':id',
      component: topDetail
    }]
  },
  {
    path: '/player',
    component: Player
  },
  {
    path: '/test',
    component: Test
  },
  {
    path: '/user',
    // component: UserCenter
    components: {
      user: UserCenter
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
