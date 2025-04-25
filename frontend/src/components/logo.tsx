import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imgSize?: number;
  textSize?: string;
}

export const Logo = ({ className, imgSize= 50, textSize= "text-lg" }: LogoProps) => {
  return (
    <div className={cn('flex flex-row items-center justify-evenly text-center', className)}>
        <img 
          src="/logo-light.svg" 
          alt="FujiHire-logo" 
          width={imgSize} 
          height={imgSize} 
        />
        <span className={textSize}>FujiHire</span>
    </div>
  )
}
