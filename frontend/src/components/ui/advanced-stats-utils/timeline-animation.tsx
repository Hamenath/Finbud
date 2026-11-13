'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TimelineAnimationProps {
  animationNum: number
  timelineRef?: React.RefObject<HTMLDivElement | null>
  className?: string
  children: React.ReactNode
}

export function TimelineAnimation({
  animationNum,
  timelineRef,
  className,
  children,
}: TimelineAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Elegant stagger appearance
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, animationNum * 60)

    return () => clearTimeout(timer)
  }, [animationNum])

  return (
    <div
      className={cn(
        'transition-all duration-700 ease-out transform',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3',
        className
      )}
    >
      {children}
    </div>
  )
}

