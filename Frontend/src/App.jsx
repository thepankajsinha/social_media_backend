import { Routes , Route, Navigate} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import { axiosInstance } from "./lib/axios";

export default function App() {
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
      <Toaster/>
    </Layout>
  )
}