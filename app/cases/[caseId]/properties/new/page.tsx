"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { UploadButton } from "@/utils/uploadthing"
import Link from "next/link"

export default function NewPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const caseId = params.caseId as string

  const [form, setForm] = useState({
    category: "",
    belongingTo: "UNKNOWN",
    nature: "",
    quantity: "",
    unit: "",
    location: "",
    description: "",
    seizureDate: ""
  })

  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!imageUrl) {
      setError("Please upload a property image before submitting")
      setIsLoading(false)
      return
    }

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        caseId,
        imageUrl
      })
    })

    if (!res.ok) {
      setError("Failed to add property. Please try again.")
      setIsLoading(false)
      return
    }

    const data = await res.json()
    router.push(`/cases/${caseId}/properties/${data.propertyId}`)
  }


  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#1e3a8a] text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">EP</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">e-Malkhana</h1>
                <p className="text-sm text-blue-200">Digital Evidence Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#ff9933] h-2"></div>
      <div className="bg-white h-2"></div>
      <div className="bg-[#138808] h-2"></div>

  

      <main className="px-4 py-8">
        <div className="mx-auto">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#1e3a8a]">Add New Property</h2>
              <p className="text-gray-600 mt-2">Register seized property and generate QR code</p>
            </div>

            <Link
              href={`/cases/${caseId}`}
              className="bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-2 font-semibold hover:bg-[#f8f9fa] transition-colors"
            >
              ← Back to Case
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-300">
            <div className="bg-[#1e3a8a] text-white px-6 py-4">
              <h3 className="text-xl font-bold">Property Registration Form</h3>
              <p className="text-sm text-blue-200 mt-1">All fields marked with * are mandatory</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
                <h4 className="font-bold text-[#1e3a8a] mb-4">Property Image Upload</h4>
                
                <div className="space-y-4">
                  {imageUrl ? (
                    <div className="flex items-start gap-4">
                      <img
                        src={imageUrl}
                        alt="Uploaded property"
                        className="w-48 h-48 object-cover border-2 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="bg-[#d4edda] border-l-4 border-[#28a745] p-3">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-[#155724] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="text-sm text-[#155724] font-semibold">Image uploaded successfully!</p>
                              <p className="text-xs text-[#155724] mt-1">You can now proceed to fill property details</p>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setImageUrl("")}
                          className="mt-3 text-sm text-red-600 hover:text-red-700 font-semibold"
                        >
                          Remove and upload different image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 p-8 text-center bg-white">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 font-semibold mb-2">Upload Property Image *</p>
                      <p className="text-sm text-gray-500 mb-4">Click below to select and upload an image</p>
                      <UploadButton
                        endpoint="propertyImage"
                        onClientUploadComplete={(res: { url: string }[]) => {
                          setImageUrl(res[0].url)
                        }}
                        onUploadError={() => {
                          setError("Image upload failed. Please try again.")
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
                <h4 className="font-bold text-[#1e3a8a] mb-4">Property Classification</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Category of Property *
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      placeholder="e.g., Electronics, Jewelry, Vehicle, Weapons"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="belongingTo" className="block text-sm font-semibold text-gray-700 mb-2">
                      Belonging To *
                    </label>
                    <select
                      id="belongingTo"
                      name="belongingTo"
                      value={form.belongingTo}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      disabled={isLoading}
                    >
                      <option value="ACCUSED">Accused</option>
                      <option value="COMPLAINANT">Complainant</option>
                      <option value="UNKNOWN">Unknown</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="nature" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nature of Property *
                    </label>
                    <input
                      id="nature"
                      name="nature"
                      type="text"
                      placeholder="e.g., Mobile Phone, Gold Chain, Motorcycle, Firearm"
                      value={form.nature}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
                <h4 className="font-bold text-[#1e3a8a] mb-4">Quantity & Storage</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="text"
                      placeholder="Enter quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 mb-2">
                      Unit
                    </label>
                    <input
                      id="unit"
                      name="unit"
                      type="text"
                      placeholder="e.g., pieces, grams, liters"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                      Storage Location *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="e.g., Rack A-12, Room 3, Locker 45"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="seizureDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Seizure
                    </label>
                    <input
                      id="seizureDate"
                      name="seizureDate"
                      type="date"
                      value={form.seizureDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a]"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f9fa] border-l-4 border-[#1e3a8a] p-4">
                <h4 className="font-bold text-[#1e3a8a] mb-4">Property Description</h4>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter detailed description including brand, model, color, serial number, unique identifiers, condition, etc."
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border-2 border-gray-300 px-4 py-2 focus:outline-none focus:border-[#1e3a8a] resize-none"
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide as much detail as possible for identification purposes
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-[#f8d7da] border-l-4 border-[#dc3545] p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-[#721c24] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-[#721c24] font-semibold">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#856404] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-[#856404] mb-1">Next Steps</h4>
                    <p className="text-sm text-[#856404]">
                      After saving, a unique QR code will be generated for this property. You can print it and attach it to the physical property for easy tracking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !imageUrl}
                  className="flex-1 bg-[#1e3a8a] text-white py-3 font-bold hover:bg-[#1e40af] transition-colors border-2 border-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Property...
                    </span>
                  ) : (
                    "SAVE PROPERTY & GENERATE QR CODE"
                  )}
                </button>

                <Link
                  href={`/cases/${caseId}`}
                  className="bg-gray-200 text-gray-700 px-8 py-3 font-bold hover:bg-gray-300 transition-colors"
                >
                  CANCEL
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-[#1e3a8a] text-white mt-16">
        <div className="px-4 py-6">
          <div className="text-center text-sm text-blue-200">
            <p>© 2025 Government of India. All rights reserved.</p>
            <p className="mt-2">e-Malkhana - Digital Evidence Management System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}