
import { Skeleton } from "@/components/ui/skeleton";
import FeedLayout from "../components/feed-layout";
import { FeedLeft } from "../components/feed-left";
import { FeedRight } from "../components/fee-right";

export default function Feed() {
  return (
    <FeedLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 w-full space-x-3 space-y-3 p-10 h-full">
        <FeedLeft/>
        <div className="flex items-center flex-col space-y-4 ">
          <div className="flex items-center space-x-4 w-full">
          <Skeleton className="h-12 w-12 rounded-full bg-foreground/10"/>
          <div className="space-y-2 flex flex-1 min-w-0 flex-col">
            <Skeleton className="h-4 w-[100%] bg-foreground/10" />
            <Skeleton className="h-4 w-[90%] bg-foreground/10" />
          </div>
          </div>
          <Skeleton className="h-[350px] w-full rounded-xl bg-foreground/10" />
        </div>
        <FeedRight/>
      </div>
    </FeedLayout>
  )
}
