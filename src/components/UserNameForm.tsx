"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { UsernameRequest, UsernameValidator } from "@/lib/validators/username"
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card'
import { Label } from './ui/Label'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'



interface Props {
    user: {
        id: string,
        username: string
    }
}

const UserNameForm = ({ user }: Props) => {
    const router = useRouter()
    const { handleSubmit, register, formState: { errors } } = useForm<UsernameRequest>({
        resolver: zodResolver(UsernameValidator),
        defaultValues: {
            name: user.username,
        }
    })

    const { mutate: handleUpdate, isPending } = useMutation({
        mutationFn: async ({ name }: UsernameRequest) => {
            const payload: UsernameRequest = { name }
            const { data } = await axios.patch("/api/username", payload)
            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                return toast({
                    title: 'Username already taken.',
                    description: 'Please choose another username.',
                    variant: 'destructive',
                })
            }
            return toast({
                title: 'Something went wrong.',
                description: 'Your username was not updated. Please try again.',
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            toast({
                description: 'Your username has been updated.',
                variant: "success"
            })
            router.refresh()
        },
    })



    return (
        <form onSubmit={handleSubmit((e) => { handleUpdate(e) })}>
            <Card>
                <CardHeader>
                    <CardTitle>Your username</CardTitle>
                    <CardDescription>
                        Please enter a display name you are comfortable with.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Label className='sr-only' htmlFor='name'>
                        Name
                    </Label>
                    <Input
                        id='name'
                        className='w-[400px] pl-6 bg-white border-neutral-500/50'
                        size={32}
                        {...register('name')}
                    />
                    {errors.name && (<p className='px-1 text-xs text-red-600'>{errors.name.message}</p>)}

                </CardContent>
                <CardFooter>
                    <Button isLoading={isPending}  >Change name</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default UserNameForm