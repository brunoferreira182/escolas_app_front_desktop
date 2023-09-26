
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/users', redirect: '/users/UsersWaitingApprovalList' },
      { path: '/users/usersWaitingApprovalList', component: () => import('pages/users/UsersWaitingApprovalList.vue') },
      { path: '/users/usersList', component: () => import('pages/users/UsersList.vue') },
      { path: '/users/userDetail', component: () => import('pages/users/UserDetail.vue') },
      { path: '/users/classesList', component: () => import('pages/users/ClassesList.vue') },
      { path: '/users/createClass', component: () => import('pages/users/CreateClass.vue') },
    ]
  },
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
