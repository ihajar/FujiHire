import { Logo } from "@/components/logo"


export const FeedFooter = () => {
  return (
    <div className='w-full flex flex-col inset-x-0 bottom-0 z-50 border-t bg-background p-3 items-start justify-between gap-y-4'>
       <Logo className="mt-0" imgSize={80} textSize="text-lg md:text-2xl"/>
    </div>
  )
}
