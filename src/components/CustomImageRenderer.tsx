import Image from 'next/image'
import React from 'react'
import img from "../../public/500x500.jpg"



const CustomImageRenderer = ({ data }: any) => {
    const src = data.file.url
    return (
        <div className=' relative min-h-[15rem] w-full'>
            <Image src={img} alt='image' className=' object-contain' fill/>
        </div>
    )
}

export default CustomImageRenderer