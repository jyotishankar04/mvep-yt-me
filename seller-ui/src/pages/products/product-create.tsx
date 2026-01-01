/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useState, useRef, type ChangeEvent, useEffect } from "react"

// ==================== Image Upload Component ====================
interface ImageUploadProps {
  images: File[]
  previewUrls: string[]
  onImagesChange: (files: File[]) => void
  onPreviewUrlsChange: (urls: string[]) => void
  maxImages?: number
}

const ImageUpload = ({
  images,
  previewUrls,
  onImagesChange,
  onPreviewUrlsChange,
  maxImages = 5
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'))
    const allowedFiles = imageFiles.slice(0, maxImages - images.length)

    if (allowedFiles.length === 0) return

    const newPreviewUrls = allowedFiles.map(file => URL.createObjectURL(file))

    onImagesChange([...images, ...allowedFiles])
    onPreviewUrlsChange([...previewUrls, ...newPreviewUrls])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    // Revoke the URL first
    URL.revokeObjectURL(previewUrls[index])

    // Create new arrays without the removed item
    const newImages = images.filter((_, i) => i !== index)
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index)

    // Update state with new arrays
    onImagesChange(newImages)
    onPreviewUrlsChange(newPreviewUrls)
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  // Cleanup on unmount - only revoke URLs that still exist
  useEffect(() => {
    const currentUrls = previewUrls
    return () => {
      currentUrls.forEach(url => {
        try {
          URL.revokeObjectURL(url)
        } catch (error) {
          // URL might already be revoked
        }
      })
    }
  }, []) // Empty dependency array - only run on unmount

  return (
    <div className="space-y-4">
      {/* Upload area - Show first if no images */}
      {images.length === 0 ? (
        <div
          onClick={handleClickUpload}
          className="relative rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary hover:bg-accent/50 transition-all duration-200 cursor-pointer group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="aspect-square flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-muted/80 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-base font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Upload Product Images
            </span>
            <p className="text-sm text-muted-foreground mt-3 px-4">
              Upload in JPG, PNG or WebP format
              <br />
              (1:1 ratio recommended, up to {maxImages} images)
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Main image preview */}
          <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
            {previewUrls[0] ? (
              <img
                src={previewUrls[0]}
                alt="Main preview"
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  console.error('Failed to load main image:', previewUrls[0])
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Image not available
              </div>
            )}
          </div>

          {/* Thumbnail previews */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Product Images ({images.length}/{maxImages})</h3>
              {images.length < maxImages && (
                <button
                  type="button"
                  onClick={handleClickUpload}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Add More
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {previewUrls.map((url, index) => (
                <div
                  key={`${index}-${url.substring(url.length - 10)}`} // Use part of URL for key
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-transparent'
                    }`}
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load thumbnail ${index}:`, url)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-xs text-muted-foreground">
                      Error
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}

              {/* Add more button as thumbnail */}
              {images.length < maxImages && (
                <div
                  onClick={handleClickUpload}
                  className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary hover:bg-accent/50 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Add</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ==================== Product Create Page ====================
const ProductCreatePage = () => {
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // Handle cleanup when component unmounts or images change
  useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts
      previewUrls.forEach(url => {
        try {
          URL.revokeObjectURL(url)
        } catch (error) {
          // URL might already be revoked
        }
      })
    }
  }, []) // Only run on unmount

  // Alternative: Use a ref to track URLs for cleanup
  const urlRefs = useRef<string[]>([])

  useEffect(() => {
    urlRefs.current = previewUrls
  }, [previewUrls])

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-6 p-6 pb-20">
      {/* Product form section - Now takes 2/3 of the width */}
      <div className="md:col-span-2 order-1 md:order-1">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium mb-2">
                    Stock Quantity
                  </label>
                  <input
                    id="stock"
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Create Product
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Image upload section - Now takes 1/3 of the width and appears at bottom on mobile */}
      <div className="md:col-span-1 order-2 md:order-2">
        <Card className="w-full sticky top-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">Product Images</h2>

            <ImageUpload
              images={images}
              previewUrls={previewUrls}
              onImagesChange={setImages}
              onPreviewUrlsChange={setPreviewUrls}
              maxImages={5}
            />

            {/* Image upload tips */}
            {images.length === 0 && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Image Guidelines</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use high-quality, well-lit images</li>
                  <li>• Square format (1:1) works best</li>
                  <li>• First image will be the main display</li>
                  <li>• Supported formats: JPG, PNG, WebP</li>
                  <li>• Maximum 5 images per product</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProductCreatePage