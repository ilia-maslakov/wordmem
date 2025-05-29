import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect,
} from "react"
import { stringToColor } from "@/utils/stringToColor.ts"
import { cn } from "@/lib/utils.ts"

interface WordButtonProps {
    word: string
    id: string
    onClick: (id: string) => void
    isSelected: boolean
    /** true – пара найдена, мигнём и удалимся */
    isMatched?: boolean
    /** вызовем через 120 мс, чтобы родитель убрал кнопку */
    onMatchedDone?: (id: string) => void
}

export interface WordButtonRef {
    revealFast: () => void
}

export const WordButton = forwardRef<WordButtonRef, WordButtonProps>(
    ({ word, id, onClick, isSelected, isMatched = false, onMatchedDone }, ref) => {
        const baseColor = stringToColor(id)
        const divRef = useRef<HTMLDivElement>(null)

        /* 120 мс держим вспышку, потом сигналим родителю */
        useEffect(() => {
            if (!isMatched) return
            const t = setTimeout(() => onMatchedDone?.(id), 120)
            return () => clearTimeout(t)
        }, [isMatched, id, onMatchedDone])

        useImperativeHandle(ref, () => ({
            revealFast: () => {
                if (divRef.current) divRef.current.style.opacity = "1"
            },
        }))

        const ring = isSelected
            ? "ring-2 ring-blue-500"
            : "hover:ring-1 hover:ring-gray-300"

        return (
            <div
                ref={divRef}
                onClick={() => onClick(id)}
                className={cn(
                    "text-center h-full rounded-lg cursor-pointer select-none",
                    ring,
                    isMatched && "bg-green-500 text-white animate-pulse-short pointer-events-none"
                )}
                /* цвет текста только пока не совпало */
                style={!isMatched ? { color: baseColor } : undefined}
            >
                {word}
            </div>
        )
    }
)
