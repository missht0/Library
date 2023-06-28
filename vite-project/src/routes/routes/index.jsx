import IndexLayout from '../layouts/IndexLayout';
import RootLayout from '../layouts/Layout';
import CreateCluster from '../layouts/instance/create_cluster';
import Page404 from 'src/pages/Page404';
import InstanceRoute from './InstanceRoute';
import IndexRoute from './IndexRoute';
import Demo from './Demo';
import Page500 from 'src/pages/Page500';
import { Navigate } from 'react-router';
import { lazy } from 'react';
import { navigatePrefix } from 'src/constants/lists';

export default [
  {
    path: '/',
    meta: {
      title: 'AutoMQ',
      isLogin: true,
    },
    component: RootLayout,
    children: [
      {
        path: '/',
        meta: {
          title: 'AutoMQ',
          isLogin: true,
        },
        component: () => (
          <Navigate to={`${navigatePrefix}/${localStorage.getItem('code')}/instance`} />
        ),
      },
      {
        path: '/create',
        meta: {
          title: 'Create Cluster',
          isLogin: true,
        },
        component: CreateCluster,
      },
      {
        path: '/personal',
        meta: {
          title: 'Personal',
          isLogin: true,
        },
        component: IndexLayout,
        children: [
          {
            path: '/personal',
            meta: {
              title: 'Profile',
              isLogin: true,
            },
            redirect: `${navigatePrefix}/personal/profile`,
          },
          {
            path: '/personal/profile',
            meta: {
              title: 'Profile',
              isLogin: true,
            },
            component: lazy(() => import('../layouts/setting/profile')),
          },
        ],
      },
      ...IndexRoute,
      ...Demo,
      ...InstanceRoute,
    ],
  },
  {
    path: '/500',
    meta: {
      title: 'Error',
    },
    component: Page500,
  },
  {
    path: '*',
    meta: {
      title: 'Page Not Found',
    },
    component: Page404,
  },
];
