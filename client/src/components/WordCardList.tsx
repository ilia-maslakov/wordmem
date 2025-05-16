import { WordList } from "./WordList"
import type { WordPair } from "@/types/wordPair"

export const WordCardList = ({
                                 left,
                                 right,
                                 onWordClick,
                             }: {
    left: (WordPair | null)[]
    right: (WordPair | null)[]
    onWordClick: (pair: WordPair, side: "left" | "right") => void
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto p-4">
            <WordList
                side="left"
                count={left.length}
                pairs={left}
                onClick={pair => pair && onWordClick(pair, "left")}
            />
            <WordList
                side="right"
                count={right.length}
                pairs={right}
                onClick={pair => pair && onWordClick(pair, "right")}
            />
        </div>
    )
}
