
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [

      //admin
      { path: "/admin", redirect: "/admin/FunctionsTypesList" },
      {
        path: "/admin/functionsTypesList",
        component: () => import("pages/admin/FunctionsTypesList.vue"),
      },
      { path: "/admin/createFunctionType", component: () => import("pages/admin/CreateFunctionType.vue"),},
      { path: "/admin/functionTypeDetail", component: () => import("pages/admin/FunctionTypeDetail.vue"),},

      //users
      { path: '/users', redirect: '/users/UsersWaitingApprovalList' },
      { path: '/users/usersWaitingApprovalList', component: () => import('pages/users/UsersWaitingApprovalList.vue') },
      { path: '/users/chatList', component: () => import('pages/users/ChatList.vue') },
      { path: '/users/usersList', component: () => import('pages/users/UsersList.vue') },
      { path: '/users/userDetail', component: () => import('pages/users/UserDetail.vue') },
      { path: '/users/classesList', component: () => import('pages/users/ClassesList.vue') },
      { path: '/users/createClass', component: () => import('pages/users/CreateClass.vue') },
      { path: '/users/classDetail', component: () => import('pages/users/ClassDetail.vue') },

      //social
      { path: '/social', redirect: '/social/PostsList' },
      { path: '/social/postsList', component: () => import('pages/social/PostsList.vue') },
      { path: '/social/createNewPost', component: () => import('pages/social/CreateNewPost.vue') },
      { path: '/social/postDetail', component: () => import('pages/social/PostDetail.vue') },

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
