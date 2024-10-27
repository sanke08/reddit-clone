"use client"
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { CreateSubredditPayload } from '@/lib/validators/subreddit'
import { toast } from '@/hooks/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'


const Page = () => {
    const [input, setInput] = useState<string>("")
    const router = useRouter()
    const { loginToast } = useCustomToasts()

    const { mutate: createCommunity, isPending } = useMutation({
        mutationFn: async () => {
            const payload: CreateSubredditPayload = {
                name: input
            }
            const { data } = await axios.post("/api/subreddit", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Subreddit already exist",
                        description: "Please choose a different subreddit name",
                        variant: "destructive"
                    })
                }
                if (err.response?.status === 422) {
                    return toast({
                        title: "Invalid Subreddit Name",
                        description: "Please choose a name between 3 and 21 Characters",
                        variant: "destructive"
                    })
                }
                if (err.response?.status === 401) {
                    return loginToast()
                }

            }
            toast({
                title: "there was a Error",
                description: 'Could not create Subreddit',
                variant: "destructive"
            })

        },
        onSuccess: (data) => {
            router.push("/r/" + data.name)
        }
    })



    return (
        <div className=' mx-auto w-full sm:w-[80vw] h-full md:w-[50vw] lg:w-[30vw] bg-white p-3 mt-5 rounded-lg shadow-lg'>
            <p className=' font-semibold text-lg py-5'>
                Create a Community
            </p>
            <div className=' bg-neutral-500/50 h-px' />
            <div className=' pt-5'>
                <p>
                    Name
                </p>
                <p className=' text-sm text-neutral-600/70 font-medium'>
                    Community names including capitalization cannot be changed.
                </p>
            </div>
            <div className=' relative'>
                <p className=' absolute left-0 w-8 justify-center text-neutral-600/50 place-items-center h-full flex items-center'>r/</p>
                <Input value={input} onChange={(e) => setInput(e.target.value)} className=' pl-6' />
            </div>
            <div className='flex justify-end gap-4 pt-3'>
                <Button
                    variant={"subtle"}
                    disabled={isPending}
                    onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button
                    disabled={input.length === 0}
                    isLoading={isPending}
                    onClick={() => createCommunity()}>
                    Create Community
                </Button>
            </div>
        </div>
    )
}

export default Page