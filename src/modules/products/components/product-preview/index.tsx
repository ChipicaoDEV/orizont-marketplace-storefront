import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block h-full">
      <div 
        data-testid="product-wrapper"
        className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 hover:border-orange-500/20"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          
          {/* subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
          
          {/* Featured Badge (if applicable) */}
          {isFeatured && (
            <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
              Recomandat
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-5 small:p-6 bg-white">
          <div className="flex-1">
            <Text className="text-[10px] uppercase tracking-[0.2em] text-[#F27A1A] font-extrabold mb-2 block">
              {product.collection?.title || "Premium Orizont"}
            </Text>
            <h3 
              className="text-gray-900 font-bold text-base small:text-lg leading-tight line-clamp-2 mb-3 min-h-[3rem] group-hover:text-[#F27A1A] transition-colors duration-300"
              data-testid="product-title"
            >
              {product.title}
            </h3>
          </div>
          
          <div className="mt-2 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Preț de la</span>
              <div className="flex items-center gap-x-2">
                {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
              </div>
            </div>
            
            {/* Interactive decorative button */}
            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-[#F27A1A] group-hover:text-white group-hover:rotate-90 transition-all duration-500 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v12m6-6H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
