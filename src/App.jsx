import { Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Signup from "./pages/signup"
import Dashboard from "./pages/Dashboard"
import AddRoom from "./pages/addroom"
import MyRooms from "./pages/myrooms"
import EditRoom from "./pages/editroom"

import Profile from "./pages/profile"


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/addroom" element={<AddRoom />} />
      <Route path="/myrooms" element={<MyRooms />} />
      <Route path="/editroom/:id" element={<EditRoom />} />
      <Route path="/profile" element={<Profile />} />


    </Routes>
  )
}



