import { Logo } from "@/components/logo"

import { UserButton } from "@/features/authentication/components/user-button";


export const FeedHeader = () => {
  return (
    <header className="w-full flex flex-row justify-between p-4 border-b border-secondary/30 shadow-md">
        <Logo />
        <UserButton/>
    </header>
  )
}
