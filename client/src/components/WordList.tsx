import type { WordPair } from "@/types/wordPair"
import { useImperativeHandle, useRef, useState } from "react"
import { WordPlaceholder } from "@/components/WordPlaceholder.tsx"
import { WordButton, type WordButtonRef } from "@/components/WordButton.tsx"
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
        const btnRefs = useRef<(WordButtonRef | null)[]>([])

        /* начальное распределение */
        const [positions, setPositions] = useState<(WordPair | null)[]>(() => {
            const shuffled = [...pairs]
                .slice(0, pairsCount)
                .sort(() => Math.random() - 0.5)
            return Array.from({ length: pairsCount }, (_, i) => shuffled[i] || null)
        })

        /* какие ячейки сейчас мигают */
        const [matched, setMatched] = useState<boolean[]>(() =>
            Array(pairsCount).fill(false)
        )

        /* пара, которую надо будет вставить, когда освободится слот */
        const [pendingPair, setPendingPair] = useState<WordPair | null>(null)

        /* ——— helpers ——— */

        const markMatched = (id: string, idx: number) => {
            setMatched(prev => {
                if (positions[idx]?.id !== id) return prev
                const next = [...prev]
                next[idx] = true
                return next
            })
        }

        const insertPair = (pair: WordPair) => {
            /* быстрый reveal — без длинной загрузочной анимации */
            btnRefs.current.forEach(r => r?.revealFast())
            setPositions(prev => {
                const freeIdx = prev.findIndex(p => p === null)
                if (freeIdx === -1) return prev
                const next = [...prev]
                next[freeIdx] = pair
                return next
            })
        }

        const handleMatchedDone = (idx: number) => {
            /* убираем кнопку после вспышки */
            setPositions(prev => {
                const next = [...prev]
                next[idx] = null
                return next
            })
            setMatched(prev => {
                const next = [...prev]
                next[idx] = false
                return next
            })

            if (pendingPair) {
                insertPair(pendingPair)
                setPendingPair(null)
            }
        }

        /* ——— API для родительского блока ——— */

        const deletePair = (id: string, idx: number) => markMatched(id, idx)

        const addPair = (pair: WordPair) => {
            const hasFreeSlot = positions.some(p => p === null)
            if (hasFreeSlot) insertPair(pair)
            else setPendingPair(pair)
        }

        useImperativeHandle(ref, () => ({
            deletePair,
            addPair,
            hasWords: () => positions.some(p => p !== null),
        }))

        /* ——— render ——— */

        return (
            <div className="flex flex-col gap-4">
                {positions.map((pair, idx) => (
                    <WordPlaceholder key={idx}>
                        {pair && (
                            <WordButton
                                ref={(r) => {
                                    btnRefs.current[idx] = r      // сохранили ссылку
                                }}
                                word={pair[side]}
                                id={pair.id}
                                onClick={() => onClick(pair.id, idx)}
                                isSelected={pair.id === selectedId && idx === selectedIndex}
                                isMatched={matched[idx]}
                                onMatchedDone={() => handleMatchedDone(idx)}
                            />
                        )}
                    </WordPlaceholder>
                ))}
            </div>
        )
    }
)
