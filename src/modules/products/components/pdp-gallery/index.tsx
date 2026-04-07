"use client"

import Image from "next/image"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

type PdpGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
}

const PdpGallery = ({ images, title }: PdpGalleryProps) => {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-y-3 text-gray-300">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm text-gray-400">Fără imagine</span>
      </div>
    )
  }

  const activeImage = images[activeIdx]

  return (
    <div className="flex flex-col gap-y-3">
      {/* Main image */}
      <div className="relative aspect-square w-full rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
        <Image
          src={activeImage.url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-center"
          quality={85}
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-x-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Imagine ${i + 1}`}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                i === activeIdx
                  ? "border-[#F27A1A] shadow-sm"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} – imagine ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover object-center"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PdpGallery
