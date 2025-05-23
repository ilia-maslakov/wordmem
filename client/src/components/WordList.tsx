import type { WordPair } from "@/types/wordPair"
import { useImperativeHandle, useState } from "react"
import { WordPlaceholder } from "@/components/WordPlaceholder.tsx"
import { WordButton } from "@/components/WordButton.tsx"
import type { WordSide } from "@/types/wordSide.tsx"
import { forwardRef } from "react"
import { pairsCount } from "@/types/consts.ts"

interface WordListProps {
    side: WordSide
    pairs: WordPair[]
    selectedId?: string | null
    selectedIndex?: number | null
    onClick: (id: string, index: number) => void
}

export interface WordListRef {
    deletePair: (id: string, index: number) => void
    addPair: (pair: WordPair) => void
    hasWords: () => boolean
}

export const WordList = forwardRef<WordListRef, WordListProps>(
    ({ side, pairs, selectedId, selectedIndex, onClick }, ref) => {
        const [positions, setPositions] = useState<(WordPair | null)[]>(() => {
            const shuffled = [...pairs]
                .slice(0, pairsCount)
                .sort(() => Math.random() - 0.5)

            return Array.from({ length: pairsCount }, (_, i) => shuffled[i] || null)
        })

        const deletePair = (id: string, targetIndex: number) => {
            setPositions(prev => {
                if (prev[targetIndex]?.id !== id) return prev
                const next = [...prev]
                next[targetIndex] = null
                return next
            })
        }

        const addPair = (newPair: WordPair) => {
            setPositions(prev => {
                const index = prev.findIndex(p => p === null)
                if (index === -1) return prev
                const updated = [...prev]
                updated[index] = newPair
                return updated
            })
        }

        useImperativeHandle(ref, () => ({
            deletePair,
            addPair,
            hasWords: () => positions.some(p => p !== null)
        }))

        return (
            <div className="flex flex-col gap-4">
                {positions.map((pair, index) => (
                    <WordPlaceholder key={index}>
                        {pair && (
                            <WordButton
                                word={pair[side]}
                                id={pair.id}
                                onClick={() => onClick(pair.id, index)}
                                isSelected={pair.id === selectedId && index === selectedIndex}
                            />
                        )}
                    </WordPlaceholder>
                ))}
            </div>
        )
    }
)
