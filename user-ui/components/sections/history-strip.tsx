import React from "react"
import Link from "next/link"

const HistoryStrip = () => {
  return (
    <section className="border-t pt-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-sm">Your browsing history</h3>
        <Link href="#" className="text-xs text-blue-600 hover:underline">
          View and Edit
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="min-w-[100px] cursor-pointer opacity-75 hover:opacity-100 transition-opacity">
            <img 
              src={`https://placehold.co/100x100/f1f5f9/64748b?text=Item+${idx}`} 
              className="rounded border bg-white" 
              alt={`History Item ${idx}`} 
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default HistoryStrip