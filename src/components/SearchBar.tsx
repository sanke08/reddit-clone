"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/Command'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Subreddit, Prisma } from "@prisma/client"
import { usePathname, useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import debounce from "lodash.debounce"
import Link from 'next/link'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'




const SearchBar = () => {
    const pathname=usePathname()
    const router = useRouter()
    const [input, setInput] = useState<string>("")
const ref=useRef<HTMLDivElement>(null)


    const { data: queryResult, isFetching, refetch, isFetched } = useQuery({
        queryFn: async () => {
            if (!input) return
            const { data } = await axios.get("/api/search?q=" + input)
            return data as (Subreddit & {
                _count: Prisma.SubredditCountOutputType
            })[]
        },
        queryKey: ["search-query"],
        enabled: false
    })

    const request = debounce( async() => {
        refetch()
    },1000)

    const debounceReq = useCallback(() => {
        request()
    }, [request])

    useOnClickOutside(ref,()=>{
        setInput("")
    })
useEffect(()=>{
    setInput("")
},[pathname])

    return (
        <Command ref={ref}  className=' rounded-lg border relative border-neutral-600/50 w-2/3 sm:w-1/2 lg:w-1/3 z-50 overflow-visible'>
            <CommandInput value={input} onValueChange={(text) => { setInput(text); debounceReq() }} placeholder='Search communities' isLoading={false} className='outline-none border-none focus:border-none focus:outline-none ring-0' />
            {
                input.length > 0 ?
                    <CommandList className=' absolute top-full bg-white shadow w-full rounded-b-md'>
                        {isFetched && <CommandEmpty>No Result found</CommandEmpty>}
                        {
                            (queryResult?.length ?? 0) > 0 ?
                                <CommandGroup heading="Communities">
                                    {
                                        queryResult?.map((subreddit) => (
                                            <CommandItem key={subreddit.id} value={subreddit.name} onSelect={(e) => { router.push("/r/" + e); router.refresh(),setInput("") }}>
                                                <Users className=' h-4 w-4 mr-2' />
                                                <Link href={`/r/${subreddit.name}`} className=' hover:bg-black/20 w-full p-1 rounded-md transition-all duration-200'>
                                                    {subreddit.name}
                                                </Link>
                                            </CommandItem>
                                        ))
                                    }
                                </CommandGroup>
                                : null
                        }
                    </CommandList>
                    : null
            }
        </Command>
    )
}

export default SearchBar


