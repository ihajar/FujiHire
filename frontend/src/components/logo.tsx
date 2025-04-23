import React from 'react'

export const Logo = () => {
  return (
    <div className='flex flex-row items-center justify-evenly'>
        <img src="/logo-light.svg" alt="FujiHire-logo" width={50} height={40} />
        <span className='text-lg'>FujiHire</span>
    </div>
  )
}
