import { Navigate, Outlet } from "react-router";
import { lazy } from "react";
import Layout from "../layouts";
import Index from "../pages/home";

export default [
  {
    path: "/",
    meta: {
      isLogin: true,
    },
    component: Layout,
    children: [
      {
        path: "/",
        meta: {
          title: "Home",
          isLogin: true,
        },
        component: Index,
      },
      {
        path: "/admin",
        meta: {
          title: "Admin",
          isLogin: true,
        },
        component: lazy(() => import("../pages/admin")),
      },
      {
        path: "/manage",
        meta: {
          title: "Manage",
          isLogin: true,
        },
        component: lazy(() => import("../pages/manage")),
      },
    ],
  },
  {
    path: "/login",
    meta: {
      title: "Login",
    },
    component: lazy(() => import("../pages/login")),
  },

  // {
  //   path: '/500',
  //   meta: {
  //     title: 'Error',
  //   },
  //   component: Page500,
  // },
  // {
  //   path: '*',
  //   meta: {
  //     title: 'Page Not Found',
  //   },
  //   component: Page404,
  // },
];
