import * as React from 'react'
import { cn } from '../../lib/utils'

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-md border border-neutral-800">
      <table className={cn('w-full text-sm', className)} {...props} />
    </div>
  )
}

export function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className="bg-neutral-900/50 text-neutral-300" {...props} />
  )
}

export function TBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className="divide-y divide-neutral-800" {...props} />
  )
}

export function TR(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="hover:bg-neutral-900/50" {...props} />
}

export function TH(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-4 py-2 text-left font-medium" {...props} />
}

export function TD(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-4 py-2" {...props} />
}
