import { Skeleton } from "@/components/ui/skeleton"


export const FeedLeft = () => {
  return (
    <div className="flex flex-col space-y-3">
        <Skeleton className="h-[80px] w-full rounded-xl bg-foreground/10" />
        <Skeleton className="h-[80px] w-full rounded-xl bg-foreground/10" />
        <Skeleton className="h-[80px] w-full rounded-xl bg-foreground/10" />
        <Skeleton className="h-[80px] w-full rounded-xl bg-foreground/10" />
    </div>
  )
}
