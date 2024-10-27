"use client"
import React, { startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useRouter } from 'next/navigation'


interface Props {
    subredditId: string
    subredditName: string
    isSubscribed: boolean
}


const SubscribeLeaveToggle = ({ subredditId, subredditName, isSubscribed }: Props) => {

    const { loginToast } = useCustomToasts()
    const router = useRouter()
    const { mutate: subscribe, isPending: isLoadingSubscribe } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }
            const { data } = await axios.post("/api/subreddit/subscribe", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: "Subscription Error",
                description: "somethig went wrong. Please try again.",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })
            return toast({
                title: "Subscribed",
                description: ` subscribed to ${subredditName} successfully `
            })
        }

    })
    const { mutate: unsubscribe, isPending: isLoadingUnSubscribe } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }
            const { data } = await axios.post("/api/subreddit/unsubscribe", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: "Subscription Error",
                description: "somethig went wrong. Please try again.",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })
            return toast({
                title: "Subscribed",
                description: ` unsubscribed to ${subredditName} successfully `
            })
        }

    })


    return isSubscribed ? (
        <Button  onClick={() => unsubscribe()} isLoading={isLoadingUnSubscribe} className=' w-full mt-2'>Leave community</Button>
    ) : (
        <Button onClick={() => subscribe()} isLoading={isLoadingSubscribe} className=' w-full mt-2'>Join to post</Button>
    )
}

export default SubscribeLeaveToggle