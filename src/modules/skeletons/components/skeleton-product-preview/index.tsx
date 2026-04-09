const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse flex flex-col h-full bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="aspect-[4/5] w-full bg-gray-100" />
      <div className="p-5 flex flex-col gap-y-3">
        <div className="w-1/3 h-3 bg-gray-100 rounded-full" />
        <div className="w-3/4 h-5 bg-gray-100 rounded-full" />
        <div className="w-1/2 h-5 bg-gray-100 rounded-full" />
        <div className="mt-2 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="w-1/3 h-4 bg-gray-100 rounded-full" />
          <div className="w-10 h-10 rounded-2xl bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
