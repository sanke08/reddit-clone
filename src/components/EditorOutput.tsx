"use client"
import dynamic from 'next/dynamic'
import React from 'react'
import CustomImageRenderer from './CustomImageRenderer'
import CustomCodeRenderer from './CustomCodeRenderer'


const Output = dynamic(
    async () => (await import("editorjs-react-renderer")).default,
    { ssr: false }
)

interface Props {
    content: any
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
    },
}


const EditorOutput = ({ content }: Props) => {
    return (
        <Output
            style={style}
            className='text-sm'
            renderers={renderers}
            data={content}
        />
    )
}

export default EditorOutput