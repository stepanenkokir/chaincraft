import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BoosterView from '../views/BoosterView.vue'
import FriendsView from '../views/FriendsView.vue'
import LeaderBoardView from '../views/LeaderBoardView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/friends',
      name: 'friends',
      component: FriendsView
    },
    {
      path: '/booster',
      name: 'booster',
      component: BoosterView
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: LeaderBoardView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
  ]
})

export default router
