import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge<'kr-text-wrap'>({
  extend: {
    classGroups: {
      'kr-text-wrap': ['text-kr-keep', 'text-kr-pretty', 'text-kr-balance', 'text-anywhere'],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs))
}
