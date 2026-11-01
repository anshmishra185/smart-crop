import * as React from 'react'

import { cn } from '../../lib/utils'

interface PageContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  )
}
