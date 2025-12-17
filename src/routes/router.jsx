import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import HelpGuidelines from "../pages/HelpGuidelines/HelpGuidelines";
import ErrorPage from "../pages/Error/Error";
import AllIssues from "../pages/Home/AllIssues/AllIssues";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
        {
            index: true,
            Component: Home,
        },
        {
            path: '/all-issues',
            Component: AllIssues,
        },
        {
          path: '/about',
          Component: About, 
        },
        {
          path: 'help-guidlines',
          Component: HelpGuidelines,
        }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: '/login',
        Component: Login,
      },
      {
        path: '/register',
        Component: Register,
      }
    ]
  }
]);