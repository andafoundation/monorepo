import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  container?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, container = true, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("py-16 md:py-20 px-4", className)}
      {...props}
    >
      {container ? (
        <div className="max-w-anda mx-auto">{children}</div>
      ) : (
        children
      )}
    </section>
  )
)
Section.displayName = "Section"

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-center mb-8 md:mb-12", className)}
    {...props}
  />
))
SectionHeader.displayName = "SectionHeader"

const SectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-3xl md:text-4xl font-semibold text-primary mb-4",
      className
    )}
    {...props}
  />
))
SectionTitle.displayName = "SectionTitle"

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm md:text-base text-ink/70 max-w-3xl mx-auto",
      className
    )}
    {...props}
  />
))
SectionDescription.displayName = "SectionDescription"

export { Section, SectionHeader, SectionTitle, SectionDescription }
