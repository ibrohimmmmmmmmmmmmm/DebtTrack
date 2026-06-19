import { lazy } from "react";

export const Register = lazy(() => import ("../pages/Register/Register"))
export const Login = lazy(() => import ("../pages/Login/Login"))
export const Dashboard = lazy(() => import ("../pages/Dashboard/Dashboard"))
export const Debts = lazy(() => import ("../pages/Debts/Debts"));
export const Contacts  = lazy(() => import ("../pages/Contacts/Contacts"))  
export const Folders = lazy(() => import ("../pages/Folders/Folders"))
export const Users = lazy(() => import ("../pages/Users/Users"))
export const Profile = lazy(() => import ("../pages/Profile/Profile"))
export const FolderDetail = lazy(() => import ("../pages/FolderDetail/FolderDetail"))
export const ContactDetail = lazy(() => import ( "../pages/Contacts/ContactDetail "))