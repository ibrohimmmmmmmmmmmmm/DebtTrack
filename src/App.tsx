import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ContactDetail, Contacts, Dashboard, Debts, DebtsDetail, FolderDetail, Login, Profile, Register, Users } from "./router/router"
import Layout from "./Layout/Layout"
import Folders from "./pages/Folders/Folders"


export default function App() {
  const router = createBrowserRouter([
    {
      path : "/",
      element: <Register />
    },
    {
      path : "/login",
      element : <Login />
    },
    {
      path: "/dashboard",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: "contacts",
          element: <Contacts />
        },
        {
          path: "folders",
          element: <Folders />
        },
        {
          path: "users",
          element: <Users />
        },
        {
          path : "profile",
          element : <Profile />
        },
        {
          path : "folder/:id",
          element : <FolderDetail />
        },
        {
          path: "contact/:id",
          element: <ContactDetail />
        },
        {
          path: "debts",
          element: <Debts />
        },
        {
          path: "debt/:id",
          element: <DebtsDetail />
        },
      ]
    }
  ])
  return <RouterProvider router={router} />
}
