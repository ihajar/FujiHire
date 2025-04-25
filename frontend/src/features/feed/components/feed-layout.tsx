import { ReactNode } from "react";
import { FeedHeader } from "./feed-header";
import { FeedFooter } from "./feed-footer";


export default function FeedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
        <FeedHeader/>
        <main>
            {children}
        </main>
        <FeedFooter/>
    </div>
  )
}
