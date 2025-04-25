import { Skeleton } from "@/components/ui/skeleton"


export const FeedRight = () => {
  return (
    <div className="flex flex-col space-y-3">
        <Skeleton className="h-[200px] w-full rounded-xl bg-foreground/10" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-foreground/10" />
            <Skeleton className="h-4 w-full bg-foreground/10" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-xl bg-foreground/10" />
    </div>
  )
}
