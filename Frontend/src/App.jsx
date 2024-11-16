import Signup from "./Pages/Signup.jsx"
import "./App.css"
import Login from "./Pages/Login.jsx"
import { Routes , Route} from "react-router-dom"
import Home from "./Pages/Home.jsx"
import Sidebar from "./Pages/Sidebar.jsx"
import PostFeed from "./Pages/PostFeed.jsx"
import RightSidebar from "./Pages/RightSidebar.jsx"

function App() {

  return (
    <div className="app-container">
      <Sidebar/>
      <PostFeed/>
      <RightSidebar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
