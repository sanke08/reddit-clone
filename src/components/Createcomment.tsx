"use client"
import React, { useState } from 'react'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { CommentRequest } from '@/lib/validators/comment'
import axios, { AxiosError } from 'axios'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

const Createcomment = ({ postId, replyToId }: { postId: string, replyToId?: string }) => {

    const [input, setInput] = useState<string>("")
    const { loginToast } = useCustomToasts()
    const router = useRouter()
    const { mutate: Post, isPending } = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId
            }
            const { data } = await axios.patch("/api/subreddit/post/comment", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: "There was a problem",
                description: "somethig went wrong. Please try again.",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            setInput("")
            router.refresh()
        }
    })



// 8:28


    return (
        <div>
            <Label htmlFor='comment' >Your comment</Label>
            <div className=' mt-2'>
                <Textarea value={input} onChange={(e) => setInput(e.target.value)} id='comment' className=' bg-white' placeholder='What are your Thought' rows={1} />
            </div>
            <div className=' mt-2 flex justify-end'>
                <Button onClick={() => Post({ text: input, postId, replyToId })} disabled={input.length===0} isLoading={isPending}  >post</Button>
            </div>
        </div>
    )
}

export default Createcomment