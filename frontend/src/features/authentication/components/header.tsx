interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center justify-center">
        <img src="/logo-light.svg" alt="FujiHire-logo" width={100} height={80} />
        <h2 className="text-xl md:text-3xl">{label}</h2>
    </div>
  )
}
