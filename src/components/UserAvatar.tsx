import React from 'react'
import { Avatar, AvatarFallback } from './ui/Avatar'
import Image from 'next/image'



const UserAvatar = ({ url, name }: { url: string | null | undefined, name: string | undefined | null }) => {
    return (
        <Avatar>
            {
                url ? <div className=' relative h-full w-full aspect-square rounded-full overflow-hidden'>
                    <Image src={url} alt='' fill className=' object-contain' referrerPolicy="no-referrer" />
                </div>
                    :
                    <AvatarFallback>
                        <span className=' font-semibold text-xl bg-gray-500 w-full h-full flex justify-center items-center pb-1 text-white'>
                            {
                                name&&
                                // @ts-ignore
                                name[0]
                            } 
                            </span>
                    </AvatarFallback>
            }
        </Avatar>
    )
}

export default UserAvatar