import { LoaderPinwheel } from "lucide-react";
import { Logo } from "./logo";

export const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            <Logo className="mb-6" imgSize={80} textSize="text-2xl" />
            <LoaderPinwheel className="size-10 animate-spin text-muted-foreground/70" />
            <p className="text-muted-foreground/80">Loading...</p>
        </div>
    )
}