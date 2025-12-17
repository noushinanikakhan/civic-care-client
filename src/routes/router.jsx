import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import HelpGuidelines from "../pages/HelpGuidelines/HelpGuidelines";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home,
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
]);