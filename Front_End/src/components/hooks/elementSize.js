import React, { useState, useEffect, useRef } from 'react'

export const elementSizeHook = (Component: any) => {
  return (props: any) => {
    const [height, setHeight] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        setHeight(ref.current.clientHeight)
        setWidth(ref.current.clientWidth)
    })

    return (<Component ref={ref} width={ref.current.clientWidth} height={ref.current.clientHeight} {...props} />)
  }
}
