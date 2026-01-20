import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f3f4f6"
    }}>

      <div style={{
        width: "400px",
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{ fontSize: "26px", marginBottom: "10px", color: "#4f46e5" }}>
          Welcome Back
        </h2>

        <p style={{ marginBottom: "20px", color: "#555" }}>
          Login to your Room Finder account
        </p>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={btnStyle}>
          Login
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          New user? <Link to="/signup">Signup</Link>
        </p>

      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc"
}

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
}
