import { useEffect, useState } from "react"
import { supabase } from "../supabase"

export default function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUser(res.data.user)
    })
  }, [])

  return (
    <div className="container">
      <h1>My Profile</h1>

      {user ? (
        <div className="card">
          <p><b>Email:</b> {user.email}</p>
          <p><b>User ID:</b> {user.id}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  )
}
