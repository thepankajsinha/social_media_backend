import { Routes , Route, Navigate} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";

export default function App() {
  const { user, checkAuth, checkingAuth} = useUserStore();

  console.log(user);
  
  // Check if user is authenticated before allowing access to routes
  useEffect(() => {
		checkAuth();
	}, [checkAuth]);

  // If checkingAuth, return null to display loading spinner
  if(checkingAuth) return null;
  
  return (
    <Layout>
      <Routes>
      <Route path='/' element={user ? <HomePage /> : <Navigate to={"/login"} />} />
				<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to={"/"} />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster/>
    </Layout>
  )
}