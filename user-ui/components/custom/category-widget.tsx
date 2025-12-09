/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryWidgetProps {
  widget: {
    title: string
    items?: string[]
    sub?: string
    img?: string
    type?: "auth"
  }
}

const CategoryWidget = ({ widget }: CategoryWidgetProps) => {
  return (
    <Card className="rounded-sm border-none shadow-md overflow-hidden bg-white h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <h3 className="text-lg font-bold mb-3">{widget.title}</h3>
        
        {widget.type === "auth" ? (
          <div className="flex flex-col gap-4 mt-2">
            <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold text-sm">
              Sign in securely
            </Button>
            <div className="relative h-[200px] w-full bg-slate-100 rounded mt-2 overflow-hidden">
              <img 
                src="https://placehold.co/300x200/eef2ff/4f46e5?text=New+Arrivals" 
                className="object-cover w-full h-full" 
                alt="Promo" 
              />
            </div>
          </div>
        ) : widget.items ? (
          <div className="grid grid-cols-2 gap-3 mb-2 flex-1">
            {widget.items.map((item: string, idx: number) => (
              <div key={idx} className="space-y-1 cursor-pointer group">
                <div className="aspect-square bg-slate-100 rounded overflow-hidden">
                  <img 
                    src={`https://placehold.co/150x150/f1f5f9/94a3b8?text=${item}`} 
                    alt={item} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 w-full bg-slate-100 mb-2 overflow-hidden cursor-pointer group">
            <img 
              src={widget.img} 
              alt={widget.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
            />
          </div>
        )}
        
        {widget.type !== "auth" && (
          <Link href="#" className="text-xs text-blue-600 hover:text-orange-600 font-medium mt-2">
            See more
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

export default CategoryWidget