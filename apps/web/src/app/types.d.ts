/// <reference types="react" />
/// <reference types="next" />

declare module 'framer-motion' {
  import type { CSSProperties, HTMLAttributes } from 'react'

  export interface MotionProps {
    initial?: Record<string, number | string>
    animate?: Record<string, number | string>
    exit?: Record<string, number | string>
    transition?: {
      duration?: number
      delay?: number
      ease?: string | number[]
      type?: string
    }
    whileHover?: Record<string, number | string>
    whileTap?: Record<string, number | string>
    whileInView?: Record<string, number | string>
    viewport?: {
      once?: boolean
      margin?: string
      amount?: number | 'some' | 'all'
    }
    style?: CSSProperties
  }

  export interface HTMLMotionProps<T> extends HTMLAttributes<T>, MotionProps {}

  export type Motion = {
    div: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLDivElement>>
  }

  export const motion: Motion
}

declare module 'next/image' {
  import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

  export interface ImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string
    alt: string
    width?: number
    height?: number
    fill?: boolean
    quality?: number
    priority?: boolean
    loading?: 'lazy' | 'eager'
    placeholder?: 'blur' | 'empty'
    blurDataURL?: string
    unoptimized?: boolean
  }

  export default function Image(props: ImageProps): JSX.Element
} 