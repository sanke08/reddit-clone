"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { zodResolver } from "@hookform/resolvers/zod"
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import TextAreaAutosize from "react-textarea-autosize"
import { useForm } from "react-hook-form"

interface Props {
  subredditId: string
}



const Editor = ({ subredditId }: Props) => {

  const pathname = usePathname()
  const router = useRouter()
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const ref = useRef<EditorJS>()
  const [isMounted, setIsMounted] = useState<boolean>(false)


  const { register, handleSubmit, formState: { errors } } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null
    }
  })

  const initializedEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    // @ts-ignore
    const Embed = (await import("@editorjs/embed")).default
    // @ts-ignore
    const Table = (await import("@editorjs/table")).default
    // @ts-ignore
    const List = (await import("@editorjs/list")).default
    // @ts-ignore
    const Code = (await import("@editorjs/code")).default
    // @ts-ignore
    const LinkTool = (await import("@editorjs/link")).default
    // @ts-ignore
    const InlineCode = (await import("@editorjs/inline-code")).default
    // @ts-ignore
    const ImageTool = (await import("@editorjs/image")).default
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady: () => {
          ref.current = editor
        },
        placeholder: "Type here to write your post",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linktool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link"
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader")
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl
                    }
                  }
                }
              }
            }
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed
        }

      })
    }
  }, [])

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId }
      const { data } = await axios.post('/api/subreddit/post/create', payload)
      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong.',
        description: 'Your post was not published. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      // turn pathname /r/mycommunity/submit into /r/mycommunity
      const newPathname = pathname.split('/').slice(0, -1).join('/')
      router.push(newPathname)
      router.refresh()
      return toast({
        description: 'Your post has been published.',
        variant:"success"
      })
    },
  })

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive"
        })
      }
    }
  }, [errors])

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await initializedEditor()
      setTimeout(() => {
        titleRef.current?.focus()
      }, 0);
    }
    if (isMounted) {
      init()
      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializedEditor])

  const onSubmit = async (data: PostCreationRequest) => {
    const blocks = await ref.current?.save()
    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId
    }
    createPost(payload)
  }

  const { ref: titRef, ...rest } = register("title")

  return (
    <div>
      <form
        id='subreddit-post-form'
        className='w-fit'
        onSubmit={handleSubmit(onSubmit)}>
        <div className='prose prose-stone dark:prose-invert'>
          <TextAreaAutosize
            // ref={(e) => {
            //   titRef(e)
            //   // @ts-ignore
            //   titleRef.current = e
            // }}
            {...register("title")}
            placeholder='Title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
          />
          <div id='editor' className='min-h-[500px]' />
          <p className='text-sm text-gray-500'>
            Use{' '}
            <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>
        </div>
      </form>
      <Button type="submit" className='w-full' form='subreddit-post-form'>Create </Button>
    </div>
  )
}

export default Editor