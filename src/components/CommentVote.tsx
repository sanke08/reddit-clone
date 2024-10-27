import { useCustomToasts } from '@/hooks/use-custom-toasts'
import React, { useEffect, useState } from 'react'
import { CommentVoteRequest } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { Button } from './ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from "@prisma/client"

type PartialVote = Pick<CommentVote, 'type'>

interface Props {
    commentId: string
    initialVoteAmt: number
    initialVote?: PartialVote
}

const CommentVotes = ({ commentId, initialVoteAmt, initialVote }: Props) => {

    const { loginToast } = useCustomToasts()
    const [voteAmt, setVoteAmt] = useState<number>(initialVoteAmt)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const preVote = usePrevious(currentVote)

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])


    const { mutate: handleVote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: CommentVoteRequest = {
                commentId,
                voteType
            }
            await axios.patch("/api/subreddit/post/comment/vote", payload)
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
        onMutate: (type) => {
            if (currentVote?.type === type) {
                // User is voting the same way again, so remove their vote
                setCurrentVote(undefined)
                if (type === 'UP') setVoteAmt((prev) => prev - 1)
                else if (type === 'DOWN') setVoteAmt((prev) => prev + 1)
            } else {
                setCurrentVote({ type })
                if (type === "UP") setVoteAmt((pre) => pre + (currentVote ? 2 : 1))
                else if (type === "DOWN") setVoteAmt((pre) => pre - (currentVote ? 2 : 1))
            }
        }
    })




    return (
        <div className=' flex items-center'>
            <Button onClick={() => handleVote("UP")} variant={"unstyle"}>
                <ArrowBigUp className={twMerge(' h-5 w-5 text-zinc-700', currentVote?.type === "UP" && "text-emerald-500 fill-emerald-500")} />
            </Button>
            <p>
                {voteAmt}
            </p>
            <Button onClick={() => handleVote("DOWN")} variant={"unstyle"}>
                <ArrowBigDown className={twMerge(' h-5 w-5 text-zinc-700', currentVote?.type === "DOWN" && "text-red-500 fill-red-500")} />
            </Button>
        </div>
    )
}

export default CommentVotes