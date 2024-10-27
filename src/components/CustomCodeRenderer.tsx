"use client"
import React from 'react'

const CustomCodeRenderer = ({data}:any) => {
  return (
    <div>
        <code>{data.code} </code>
    </div>
  )
}

export default CustomCodeRenderer