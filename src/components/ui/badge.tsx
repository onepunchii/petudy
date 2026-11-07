import * as React from "react"
import { appCardClass } from "@/components/app/tokens"
import { cn } from "@/lib/utils"

/* 작은 공용 카드·배지. 색은 사이트 토큰만 씁니다 (docs/BRAND_SPACE_CONCEPT.md 8장) */

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(appCardClass, "text-ink", className)}
        {...props}
    />
))
Card.displayName = "Card"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const BADGE_VARIANT: Record<BadgeVariant, string> = {
    default: "bg-pine-soft text-pine",
    secondary: "bg-paper-2 text-ink-2",
    destructive: "bg-pass text-danger ring-1 ring-inset ring-danger/30",
    outline: "bg-pass text-ink-2 ring-1 ring-inset ring-line",
}

const Badge = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }
>(({ className, variant = "default", ...props }, ref) => (
    <div ref={ref} className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold transition-colors", BADGE_VARIANT[variant], className)} {...props} />
))
Badge.displayName = "Badge"

export { Card, CardContent, Badge }
