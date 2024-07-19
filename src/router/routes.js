
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
      { path: "/admin/archiveSender", component: () => import("pages/admin/ArchiveSender.vue"),},
      { path: "/admin/archiveList", component: () => import("pages/admin/ArchiveList.vue"),},
      { path: "/admin/eventsList", component: () => import("pages/admin/EventsList.vue"),},
      { path: "/admin/createEvent", component: () => import("pages/admin/CreateEvent.vue"),},
      { path: "/admin/eventDetail", component: () => import("pages/admin/EventDetail.vue"),},
      { path: "/admin/menuList", component: () => import("pages/admin/MenuList.vue"),},
      { path: "/admin/createMenu", component: () => import("pages/admin/CreateMenu.vue"),},
      { path: "/admin/menuDetail", component: () => import("pages/admin/MenuDetail.vue"),},
      { path: "/admin/departmentsList", component: () => import("pages/admin/DepartmentsList.vue"),},
      { path: "/admin/newDepartment", component: () => import("pages/admin/NewDepartment.vue"),},
      { path: "/admin/departmentDetail", component: () => import("pages/admin/DepartmentDetail.vue"),},
      { path: "/admin/registrationsList", component: () => import("pages/admin/RegistrationsList.vue"),},
      { path: "/admin/newRegistration", component: () => import("pages/admin/NewRegistration.vue"),},
      { path: "/admin/registrationsRequested", component: () => import("pages/admin/RegistrationsRequested.vue"),},
      { path: "/admin/registrationDetail", component: () => import("pages/admin/RegistrationDetail.vue"),},




      //users
      { path: '/users', redirect: '/users/UsersWaitingApprovalList' },
      { path: '/users/usersWaitingApprovalList', component: () => import('pages/users/UsersWaitingApprovalList.vue') },
      { path: '/users/attendanceList', component: () => import('pages/users/AttendanceList.vue') },
      { path: '/users/chatList', component: () => import('pages/users/ChatList.vue') },
      { path: '/users/usersList', component: () => import('pages/users/UsersList.vue') },
      { path: '/users/userDetail', component: () => import('pages/users/UserDetail.vue') },
      { path: '/users/classesList', component: () => import('pages/users/ClassesList.vue') },
      { path: '/users/createClass', component: () => import('pages/users/CreateClass.vue') },
      { path: '/users/classDetail', component: () => import('pages/users/ClassDetail.vue') },
      { path: '/users/childrenList', component: () => import('pages/users/ChildrenList.vue') },
      { path: '/users/childDetail', component: () => import('pages/users/ChildDetail.vue') },


      //social
      { path: '/social', redirect: '/social/PostsList' },
      { path: '/social/postsList', component: () => import('pages/social/PostsList.vue') },
      { path: '/social/createNewPost', component: () => import('pages/social/CreateNewPost.vue') },
      { path: '/social/postDetail', component: () => import('pages/social/PostDetail.vue') },
      { path: '/social/manageComments', component: () => import('pages/social/ManageComments.vue') },
      { path: '/social/createNewSchoolEvent', component: () => import('pages/social/CreateNewSchoolEvent.vue') },
      { path: '/social/schoolEventsList', component: () => import('pages/social/SchoolEventsList.vue') },
      { path: '/social/schoolEventDetail', component: () => import('pages/social/SchoolEventDetail.vue') },
      { path: '/social/notesList', component: () => import('pages/social/NotesList.vue') },
      { path: '/social/createNewNote', component: () => import('pages/social/CreateNewNote.vue') },
      { path: '/social/noteDetail', component: () => import('pages/social/NoteDetail.vue') },

      // departments
      { path: '/departments', redirect: '/departments/solicitationsNotTreated' },
      { path: '/departments/solicitationsNotTreated', component: () => import('src/pages/departments/SolicitationsNotTreated.vue') },
      { path: '/departments/solicitationsInTreatment', component: () => import('src/pages/departments/SolicitationsInTreatment.vue') },
      { path: '/departments/solicitationsClosed', component: () => import('src/pages/departments/SolicitationsClosed.vue') },
      { path: '/departments/solicitationsOpened', component: () => import('src/pages/departments/SolicitationsOpened.vue') },

      { path: '/departments/solicitationDetails', component: () => import('src/pages/departments/SolicitationDetails.vue') },
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
