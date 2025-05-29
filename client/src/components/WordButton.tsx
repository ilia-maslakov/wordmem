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
    isMatched?: boolean          // true → вспышка рамкой
    onMatchedDone?: (id: string) => void
}

export interface WordButtonRef {
    revealFast: () => void
}

export const WordButton = forwardRef<WordButtonRef, WordButtonProps>(
    ({ word, id, onClick, isSelected, isMatched = false, onMatchedDone }, ref) => {
        const baseColor = stringToColor(id)
        const divRef = useRef<HTMLDivElement>(null)

        /* 120 мс показываем зелёную рамку, затем просим родителя убрать */
        useEffect(() => {
            if (!isMatched) return
            const t = setTimeout(() => onMatchedDone?.(id), 120)
            return () => clearTimeout(t)
        }, [isMatched, id, onMatchedDone])

        /* внешний «быстрый reveal» */
        useImperativeHandle(ref, () => ({
            revealFast: () => {
                if (divRef.current) divRef.current.style.opacity = "1"
            },
        }))

        /* выбираем класс обводки */
        const ringClass = isMatched
            ? "ring-2 ring-green-500"                // зелёная вспышка
            : isSelected
                ? "ring-2 ring-blue-500"
                : "hover:ring-1 hover:ring-gray-300"

        return (
            <div
                ref={divRef}
                onClick={() => onClick(id)}
                className={cn(
                    "text-center h-full rounded-lg cursor-pointer select-none flex items-center justify-center",
                    ringClass,
                    isMatched && "pointer-events-none"   // во время вспышки не кликаем
                )}
                /* цвет текста остаётся фирменным */
                style={{ color: baseColor }}
            >
                {word}
            </div>
        )
    }
)
