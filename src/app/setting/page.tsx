import UserNameForm from '@/components/UserNameForm'
import { getAuthSession } from '@/lib/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
  title: "Setting",
  description: 'manage your account',
}


const page = async () => {

  const session = await getAuthSession()
  if (!session?.user) return redirect("/sign-in")



  return (
    <div className=' p-5'>
      {/* @ts-ignore */}
      <UserNameForm user={{ id: session.user.id, username: session?.user?.username }} />
    </div>
  )
}

export default page