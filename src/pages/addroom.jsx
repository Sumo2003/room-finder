import { useState } from "react"
import { supabase } from "../supabase"
import { useNavigate } from "react-router-dom"

export default function AddRoom() {
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [rent, setRent] = useState("")
  const [description, setDescription] = useState("")
  const [contact, setContact] = useState("")
  const [roomType, setRoomType] = useState("")
  const [tenantType, setTenantType] = useState("")
  const [images, setImages] = useState([])

  const navigate = useNavigate()

  // ✅ Upload images to Supabase storage (FIXED)
  const uploadImages = async () => {
    let uploadedUrls = []

    for (let file of images) {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = `rooms/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,   // 🔥 VERY IMPORTANT
        })

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message)
        return []
      }

      const { data } = supabase.storage
        .from("room-images")
        .getPublicUrl(filePath)

      uploadedUrls.push(data.publicUrl)
    }

    return uploadedUrls
  }

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser()

    const imageUrls = await uploadImages()

    const { error } = await supabase.from("rooms").insert([
      {
        user_id: userData.user.id,
        title,
        location,
        rent,
        description,
        contact,
        room_type: roomType,
        tenant_type: tenantType,
        images: imageUrls,
      },
    ])

    if (error) {
      alert(error.message)
    } else {
      alert("Room added successfully!")
      navigate("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-6">Add Room</h2>

        <div className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Title"
            onChange={e => setTitle(e.target.value)} />

          <input className="w-full border p-2 rounded" placeholder="Location"
            onChange={e => setLocation(e.target.value)} />

          <input className="w-full border p-2 rounded" placeholder="Rent"
            onChange={e => setRent(e.target.value)} />

          <input className="w-full border p-2 rounded" placeholder="Contact"
            onChange={e => setContact(e.target.value)} />

          <select className="w-full border p-2 rounded"
            onChange={e => setRoomType(e.target.value)}>
            <option value="">Property Type</option>
            <option value="1BHK">1 BHK</option>
            <option value="2BHK">2 BHK</option>
            <option value="3BHK">3 BHK</option>
            <option value="PG">PG</option>
          </select>

          <select className="w-full border p-2 rounded"
            onChange={e => setTenantType(e.target.value)}>
            <option value="">Tenant Preference</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Family">Family</option>
            <option value="Girls">Girls</option>
            <option value="Working">Working</option>
          </select>

          <textarea className="w-full border p-2 rounded"
            placeholder="Description"
            onChange={e => setDescription(e.target.value)} />

          {/* ✅ Image Upload */}
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => setImages([...e.target.files])}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Add Room
          </button>
        </div>

      </div>
    </div>
  )
}
