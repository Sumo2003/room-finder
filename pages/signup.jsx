import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Account created successfully!")
      navigate("/")
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Create Account</h2>
        <p className="subtitle">Signup for Room Finder</p>

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup} className="button">
          Signup
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account? <a href="/" className="link">Login</a>
        </p>
      </div>
    </div>
  )
}
