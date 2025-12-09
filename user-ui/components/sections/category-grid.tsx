import React from "react"
import CategoryWidget from "@/components/custom/category-widget"

const CategoryGrid = () => {
  const categoryWidgets = [
    { 
      title: "Revamp your home", 
      items: ["Bedsheets", "Curtains", "Lighting", "Decor"], 
      img: "https://placehold.co/400x300/f8fafc/64748b?text=Home+Decor" 
    },
    { 
      title: "Up to 60% off | Styles for Men", 
      items: ["Clothing", "Footwear", "Watches", "Bags"], 
      img: "https://placehold.co/400x300/f8fafc/64748b?text=Men's+Fashion" 
    },
    { 
      title: "Bluetooth Calling Smartwatches", 
      sub: "Starts ₹1,999", 
      img: "https://placehold.co/400x300/f8fafc/64748b?text=Smartwatch" 
    },
    { 
      title: "Sign in for your best experience", 
      type: "auth" 
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {categoryWidgets.map((widget, index) => (
        <CategoryWidget key={index} widget={widget} />
      ))}
    </div>
  )
}

export default CategoryGrid