"use client"

export default function CasePrintClient() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-[#1e3a8a] text-white px-6 py-2 font-semibold hover:bg-[#1e40af] transition-colors border-2 border-[#1e3a8a]"
    >
      Print Case Report
    </button>
  )
}
