import {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { name: 'play', path: 'mode/play', component: () => import('pages/ModePlayPage.vue') },
      { path: 'database', component: () => import('pages/DatabasePage.vue') },
      { name: 'my-deck', path: 'my-deck', component: () => import('pages/MyDeckPage.vue') },
      { name: 'password-used', path: 'password-used', component: () => import('pages/savegame/PasswordUsed.vue') },
      { name: 'opponents', path: 'opponents', component: () => import('pages/OpponentPage.vue') },
      { name: 'wishlist', path: 'wishlist', component: () => import('pages/WishlistPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
