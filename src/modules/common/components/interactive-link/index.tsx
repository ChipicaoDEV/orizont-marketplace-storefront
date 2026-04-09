import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className="flex gap-x-1 items-center group text-[#F27A1A] hover:text-[#D4600E] transition-colors duration-200"
      href={href}
      onClick={onClick}
      {...props}
    >
      <span className="text-sm font-medium">{children}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
      >
        <path d="M7 17L17 7M17 7H7M17 7V17" />
      </svg>
    </LocalizedClientLink>
  )
}

export default InteractiveLink
