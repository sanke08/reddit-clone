"use client"
import { User } from "next-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import React from 'react'
import UserAvatar from "./UserAvatar"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface Props {
    user: {
        id: string
        name: string
        email: string
        emailVerified: null | boolean
        username: string
        image: string
    },
}


const UserAccountNav = ({ user }: Props) => {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger className=" rounded-full">
                <UserAvatar url={user.image} name={user.name} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" bg-white w-max px-4 py-2 mr-5">
                <div className=" flex flex-col ">
                    {user.name && <div className=" font-medium text-lg">{user.name}</div>}
                    {user.email && <div className=" text-neutral-600 text-sm">{user.email} </div>}
                </div>
                <DropdownMenuSeparator className=" bg-black/10 mt-1" />
                <DropdownMenuItem asChild>
                    <Link href={"/"} className=" w-full">
                        feed
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={"/r/create"} className=" w-full">
                        create Community
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={"/setting"} className=" w-full">
                        setting
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { signOut({ callbackUrl: `${window.location.origin}/sign-in` }) }}>
                    signout
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}

export default UserAccountNav