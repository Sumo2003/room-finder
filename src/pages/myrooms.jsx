import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"

export default function MyRooms() {
  const [rooms, setRooms] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchMyRooms()
  }, [])

  const fetchMyRooms = async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) return

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.log(error)
    } else {
      setRooms(data || [])
    }
  }

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return

    await supabase.from("rooms").delete().eq("id", id)
    fetchMyRooms()
  }

  return (
    <div className="container">
      <h1>My Rooms</h1>

      <div className="grid">
        {rooms.map((room) => (
          <div className="card" key={room.id}>

            {room.images && room.images.length > 0 && (
              <img
                src={room.images[0]}
                alt="Room"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "10px"
                }}
              />
            )}

            <h2>{room.title}</h2>
            <p>{room.location}</p>
            <p className="price">₹ {room.rent}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn" onClick={() => navigate(`/editroom/${room.id}`)}>
                Edit
              </button>

              <button className="btn delete" onClick={() => deleteRoom(room.id)}>
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
