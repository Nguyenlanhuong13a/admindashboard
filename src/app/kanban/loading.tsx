import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex items-center justify-between">
         <Skeleton className="h-8 w-48" />
         <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-80 h-[600px] rounded-lg shrink-0" />
        ))}
      </div>
    </div>
  )
}
