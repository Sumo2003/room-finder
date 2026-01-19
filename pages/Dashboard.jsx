import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { useNavigate, Link } from "react-router-dom"

export default function Dashboard() {
  const [rooms, setRooms] = useState([])
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [loading, setLoading] = useState(true)

  // 👇 image slider state
  const [activeImage, setActiveImage] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    fetchRooms()
  }, [filter, search, minPrice, maxPrice])

  const fetchRooms = async () => {
    setLoading(true)

    let query = supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false })

    if (minPrice) query = query.gte("rent", minPrice)
    if (maxPrice) query = query.lte("rent", maxPrice)

    if (filter) query = query.eq("room_type", filter)

    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`)
    }

    const { data } = await query
    setRooms(data || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <div className="container">

      {/* Header */}
      <div className="header">
        <h1>🏠 Room Finder</h1>

        <div>
          <Link to="/addroom" className="btn">Add Room</Link>{" "}
          <Link to="/myrooms" className="btn">My Rooms</Link>{" "}
          <Link to="/profile" className="btn">Profile</Link>{" "}
          <button onClick={handleLogout} className="btn logout">Logout</button>
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title or location..."
          className="filter"
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          className="filter"
          placeholder="Min Price"
          onChange={e => setMinPrice(e.target.value)}
        />

        <input
          className="filter"
          placeholder="Max Price"
          onChange={e => setMaxPrice(e.target.value)}
        />

        <select className="filter" onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Rooms</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
          <option value="Family">Family</option>
          <option value="Couple">Couple</option>
          <option value="1BHK">1 BHK</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
        </select>
      </div>

      {/* Loader */}
      {loading && (
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          Loading rooms...
        </p>
      )}

      {/* Empty State */}
      {!loading && rooms.length === 0 && (
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          No rooms found 😔
        </p>
      )}

      {/* Cards Grid */}
      <div className="grid">
        {!loading && rooms.map((room) => (
          <div className="card" key={room.id}>

            {/* Image Slider */}
            {room.images && room.images.length > 0 && (
              <div style={{ position: "relative" }}>
                <img
                  src={room.images[activeImage[room.id] || 0]}
                  alt="Room"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "8px"
                  }}
                />

                {room.images.length > 1 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                      className="btn"
                      onClick={() =>
                        setActiveImage({
                          ...activeImage,
                          [room.id]:
                            ((activeImage[room.id] || 0) - 1 + room.images.length) %
                            room.images.length,
                        })
                      }
                    >
                      ◀
                    </button>

                    <button
                      className="btn"
                      onClick={() =>
                        setActiveImage({
                          ...activeImage,
                          [room.id]:
                            ((activeImage[room.id] || 0) + 1) % room.images.length,
                        })
                      }
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            )}

            <h2>{room.title}</h2>
            <p>{room.location}</p>

            <p className="price">₹ {room.rent}</p>

            <span className="type">{room.room_type}</span>

            <p>{room.description}</p>

            <p className="phone">📞 {room.contact}</p>

            <p><b>Tenant:</b> {room.tenant_type}</p>

          </div>
        ))}
      </div>

    </div>
  )
}
