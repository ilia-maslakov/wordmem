import type { WordPair } from "@/types/wordPair"
import type { FC } from "react"
import {stringToColor} from "@/utils/stringToColor.ts";

interface WordListProps {
    side: "left" | "right"
    count: number
    pairs: (WordPair | null)[]
    onClick: (wordPair: WordPair) => void
}

export const WordList: FC<WordListProps> = ({ side, count, pairs, onClick }) => {
    const key = side === "left" ? "russian" : "english"

    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: count }).map((_, index) => {
                const pair = pairs[index]
                const color = pair ? stringToColor(pair.id) : "#f0f0f0"
                const style = pair ? { backgroundColor: color } : {}
                return (
                    <div
                        key={index}
                        onClick={() => pair && onClick(pair)}
                        className="min-h-[60px] border rounded-lg flex items-center justify-center text-gray-400 cursor-pointer"
                        style={style}
                    >
                        {pair ? pair[key] : null}
                    </div>
                )
            })}
        </div>
    )
}
