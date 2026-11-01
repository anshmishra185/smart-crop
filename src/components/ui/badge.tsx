import * as React from 'react'

import { cn } from '../../lib/utils'

export function Badge({
  className,
  children,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800',
        className,
      )}
    >
      {children}
    </span>
  )
}
