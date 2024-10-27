"use client"
import React, { useEffect, useState } from 'react'
import { VoteType } from "prisma/prisma-client"
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { usePrevious } from '@mantine/hooks'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useMutation } from '@tanstack/react-query'
import { PostVoteRequest } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

interface Props {
    postId: string
    initialVoteAmt: number
    initialVote: VoteType | null | undefined
}



const PostVotesClient = ({ postId, initialVoteAmt, initialVote }: Props) => {

    const { loginToast } = useCustomToasts()
    const [voteAmt, setVoteAmt] = useState<number>(initialVoteAmt)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const preVote = usePrevious(currentVote)

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])


    const { mutate: handleVote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: PostVoteRequest = {
                postId,
                voteType,
            }
            await axios.patch("/api/subreddit/post/vote", payload)
        },
        onError: (err, voteType) => {
            if (voteType === 'UP') setVoteAmt((prev) => prev - 1)
            else setVoteAmt((prev) => prev + 1)
            setCurrentVote(preVote)
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong.',
                description: 'Your vote was not registered. Please try again.',
                variant: 'destructive',
            })
        },
        onMutate: (type: VoteType) => {
            if (currentVote === type) {
                // User is voting the same way again, so remove their vote
                setCurrentVote(undefined)
                if (type === 'UP') setVoteAmt((prev) => prev - 1)
                else if (type === 'DOWN') setVoteAmt((prev) => prev + 1)
            } else {
                setCurrentVote(type)
                if (type === "UP") setVoteAmt((pre) => pre + (currentVote ? 2 : 1))
                else if (type === "DOWN") setVoteAmt((pre) => pre - (currentVote ? 2 : 1))
            }
        }
    })



    return (
        <div className=' flex flex-col items-center'>
            <Button onClick={() => handleVote("UP")} variant={"unstyle"}>
                <ArrowBigUp className={twMerge(' h-5 w-5 text-zinc-700', currentVote === "UP" && "text-emerald-500 fill-emerald-500")} />
            </Button>
            <p>
                {voteAmt}
            </p>
            <Button onClick={() => handleVote("DOWN")} variant={"unstyle"}>
                <ArrowBigDown className={twMerge(' h-5 w-5 text-zinc-700', currentVote === "DOWN" && "text-red-500 fill-red-500")} />
            </Button>
        </div>
    )
}

export default PostVotesClient