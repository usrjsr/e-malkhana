"use client"

export default function QRPrintClient() {
  return (
    <button
      onClick={() => window.print()}
      className="border px-4 py-2 rounded hover:bg-gray-100"
    >
      Print QR Code
    </button>
  )
}
