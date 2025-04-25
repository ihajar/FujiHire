import { Logo } from "@/components/logo"


export const FeedHeader = () => {
  return (
    <header className="w-full flex flex-row justify-between px-4 py-2 border-b border-secondary/30 shadow-md">
        <Logo />
        <div className="flex flex-row items-center justify-evenly">
            <p>user@example.com</p>
            <span className="px-2"> | </span>
            <p>logout</p>
        </div>
    </header>
  )
}
