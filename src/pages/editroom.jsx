import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import { useNavigate, useParams } from "react-router-dom"

export default function EditRoom() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [rent, setRent] = useState("")
  const [description, setDescription] = useState("")
  const [contact, setContact] = useState("")
  const [roomType, setRoomType] = useState("")
  const [tenantType, setTenantType] = useState("")
  const [images, setImages] = useState([])

  useEffect(() => {
    fetchRoom()
  }, [])

  const fetchRoom = async () => {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single()

    setTitle(data.title)
    setLocation(data.location)
    setRent(data.rent)
    setDescription(data.description)
    setContact(data.contact)
    setRoomType(data.room_type)
    setTenantType(data.tenant_type)
  }

  const uploadImages = async () => {
    let uploadedUrls = []

    for (let file of images) {
      const filePath = `rooms/${Date.now()}-${file.name}`

      const { error } = await supabase.storage
        .from("room-images")
        .upload(filePath, file)

      if (!error) {
        const { data } = supabase.storage
          .from("room-images")
          .getPublicUrl(filePath)

        uploadedUrls.push(data.publicUrl)
      }
    }

    return uploadedUrls
  }

  const handleUpdate = async () => {
    let imageUrls = []

    if (images.length > 0) {
      imageUrls = await uploadImages()
    }

    await supabase.from("rooms").update({
      title,
      location,
      rent,
      description,
      contact,
      room_type: roomType,
      tenant_type: tenantType,
      images: imageUrls.length ? imageUrls : undefined
    }).eq("id", id)

    alert("Room updated successfully!")
    navigate("/myrooms")
  }

  return (
    <div className="container">
      <h1>Edit Room</h1>

      <div className="form">
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <input className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
        <input className="input" value={rent} onChange={e => setRent(e.target.value)} placeholder="Rent" />
        <input className="input" value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact" />

        <select className="input" value={roomType} onChange={e => setRoomType(e.target.value)}>
          <option value="">Property Type</option>
          <option value="1BHK">1 BHK</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
          <option value="Family">Family</option>
          <option value="Couple">Couple</option>
        </select>

        <select className="input" value={tenantType} onChange={e => setTenantType(e.target.value)}>
          <option value="">Tenant Preference</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Family">Family</option>
          <option value="Girls">Girls</option>
          <option value="Working">Working</option>
        </select>

        <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />

        <input type="file" multiple onChange={(e) => setImages(e.target.files)} />

        <button className="btn" onClick={handleUpdate}>
          Update Room
        </button>
      </div>
    </div>
  )
}
