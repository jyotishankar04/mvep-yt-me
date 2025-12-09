import React from "react"
import Link from "next/link"

interface SectionHeaderProps {
  title: string
  linkText?: string
  linkHref?: string
  description?: string
  align?: "left" | "center"
}

const SectionHeader = ({ 
  title, 
  linkText, 
  linkHref, 
  description, 
  align = "left" 
}: SectionHeaderProps) => {
  return (
    <div className={`mb-6 ${align === "center" ? "text-center" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {linkText && linkHref && (
          <Link 
            href={linkHref} 
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            {linkText}
          </Link>
        )}
      </div>
      {description && (
        <p className="text-slate-600 text-sm">{description}</p>
      )}
    </div>
  )
}

export default SectionHeader