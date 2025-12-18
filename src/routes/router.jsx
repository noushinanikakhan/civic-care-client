import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import HelpGuidelines from "../pages/HelpGuidelines/HelpGuidelines";
import ErrorPage from "../pages/Error/Error";
import AllIssues from "../pages/Home/AllIssues/AllIssues";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Citizens from "../pages/Dashboard/Citizens/Citizens";
import MyIssues from "../pages/Dashboard/Citizens/MyIssues";
import ReportIssue from "../pages/Dashboard/Citizens/ReportIssue";
import CitizenProfile from "../pages/Dashboard/Citizens/CitizenProfile";
import StaffDashboard from "../pages/Dashboard/staff/StaffDashboard";
import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";

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
  },
  {
    path: 'dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
       {
      index: true, // This handles /dashboard
      element: <Navigate to="citizens" replace />,
      },
      {
        path: 'citizens',
        children: [{
        index: true,
        Component: Citizens,
        },
       {
            path: 'my-issues',
            Component: MyIssues, // /dashboard/citizens/my-issues
          },
          {
            path: 'report-issue',
            Component: ReportIssue, // /dashboard/citizens/report-issue
          },
          {
            path: 'profile',
            Component: CitizenProfile, // /dashboard/citizens/profile
          }
      ]
      },
      {
        path: 'staff',
        children: [{
          index: true,
          Component: StaffDashboard, // /dashboard/staff
        }]
      },
      {
        path: 'admin',
        children: [{
          index: true,
          Component: AdminDashboard, // /dashboard/admin
        }]
      }
    ]
  }
]);