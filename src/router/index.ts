import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameManagementView from '@/views/GameManagementView.vue'
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
	},

	{
		path: '/player',
		name: 'Player',

		component: () => import('../views/PlayerView.vue')
	}, {
		path: '/playerSimple',
		name: 'playerSimple',

		component: () => import('../views/PlayerSimpleView.vue')
	},
	{
		path: '/game/:gameId?',
		name: 'GameManagement',
		props: route => ({ gameId: route.params.gameId || null }),

		component: GameManagementView
	},
	{
		path: '/history',
		name: 'History',

		component: () => import('../views/HistoryView.vue')
	},
	{
		path: '/loginUserList',
		name: 'LoginUserList',
		component: () => import('../views/LoginUserListView.vue')

	}

]

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes
})

export default router
