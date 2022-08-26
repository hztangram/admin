import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import SignIn from 'views/auth/SignIn';
import Register from 'views/auth/Register';
//
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const TangramUsers = Loadable(lazy(() => import('views/users/TangramUsers')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const TotalRoutes = (isLoggedIn, defaultPath) => [
    isLoggedIn
        ? {
              path: defaultPath,
              element: <MainLayout />,
              children: [
                  {
                      path: defaultPath,
                      element: <TangramUsers />
                  },
                  {
                      path: '/tangramAdmin/dashboard',
                      children: [
                          {
                              path: 'default',
                              element: <DashboardDefault />
                          }
                      ]
                  },
                  {
                      path: 'users',
                      children: [
                          {
                              path: 'tangram',
                              element: <TangramUsers />
                          }
                      ]
                  }
              ]
          }
        : {
              path: defaultPath,
              element: <MinimalLayout />,
              children: [
                  {
                      path: defaultPath,
                      element: <SignIn />
                  },
                  {
                      path: '/tangramAdmin/register',
                      element: <Register />
                  }
              ]
          }
];

export default TotalRoutes;
