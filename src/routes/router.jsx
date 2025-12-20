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
import IssueDetails from "../pages/IssueDetails/IssueDetails";
import DashboardRedirect from "../pages/Dashboard/DashboardRedirect";
import AdminRoute from "./AdminRoute";
import AdminAllIssues from "../pages/Dashboard/Admin/AdminAllIssues";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile";
import ManageStaff from "../pages/Dashboard/Admin/ManageStaff";
import StaffAssignedIssues from "../pages/Dashboard/staff/StaffAssignedIssues";
import StaffProfile from "../pages/Dashboard/staff/StaffProfile";

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
        path: 'issues/:id',
        element: <PrivateRoute><IssueDetails /></PrivateRoute>,
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
        index: true,
        element: <DashboardRedirect />,
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
        },
          {
            path: 'assigned-issues',
            Component: StaffAssignedIssues,
          },
          {
            path: 'profile',
            Component: StaffProfile,
          }
        
      ]
      },
  {
  path: "admin",
  children: [
    { 
      index: true, Component: AdminDashboard 
    },
    { 
      path: "all-issues", 
      Component: AdminAllIssues 
    },
    { 
      path: "manage-users", 
      Component: ManageUsers 
    },
    { 
      path: "manage-staff", 
      Component: ManageStaff 
    },
    // { 
    //   path: "payments", 
    //   Component: AdminPayments 
    // },
    { 
      path: "profile", 
      Component: AdminProfile
    },
  ],
},

    ]
  }
]);