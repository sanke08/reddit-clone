import React from 'react'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import CustomFeed from '@/components/CustomFeed'
import GeneralFeed from '@/components/GeneralFeed'

const page = async () => {
  const session = await getAuthSession()


  return (
    <div className=' w-full p-3 pt-5'>
      <div className=' flex gap-10'>
        <div className=' w-full'>
          {session ? <CustomFeed /> : <GeneralFeed />}
        </div>
        <div className=' border h-max hidden md:block border-neutral-400/50 rounded-lg overflow-hidden pb-5'>
          <div className=' flex gap-1 items-center bg-green-300/40 p-5 rounded-lg'>
            <Home size={20} />
            Home
          </div>
          <div className=' p-5 text-neutral-500'>
            <p>  Your personal Breadit frontpage. Come here to check in with your
              favorite communities.
            </p>
          </div>
          <div className=' px-10'>
            <Link href={"/r/create"}>
              <Button className=' w-full'>Create community</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page