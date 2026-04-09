"use client"

import Link from "next/link"
import React from "react"

/**
 * Wrapper around Next.js `<Link />` for internal navigation.
 * Country code is handled transparently by the middleware via URL rewrites,
 * so links use clean paths without any country prefix.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
