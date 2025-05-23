import { WordListsBlock, type WordListsBlockRef } from "@/components/WordListsBlock.tsx"
import type { WordSide } from "@/types/wordSide.tsx"
import { useEffect, useRef, useState } from "react"
import type { SelectedPair } from "@/types/selectedPair.ts"
import { StatsWidget } from "@/components/StatsWidget.tsx"
import type { Stats } from "@/types/stats.ts"
import { useLoadWordPairs } from "@/hooks/useLoadWordPairs.ts"
import { Button } from "@/components/ui/button.tsx"

export const App = () => {
    const [stats, setStats] = useState<Stats>({ correctCount: 0, turn: 0, totalCount: null })
    const [selected, setSelected] = useState<SelectedPair | null>(null)
    const ref = useRef<WordListsBlockRef | null>(null)

    const { loading, error, setPairs, pairs, refetch } = useLoadWordPairs(10)

    const reloadGame = () => {
        setSelected(null)
        setStats({ correctCount: 0, turn: 0, totalCount: null })
        refetch()
    }

    const handleWordClick = (id: string, side: WordSide, index: number) => {
        if (!selected) {
            setSelected({ side, id, index })
            return
        }

        if (selected.side === side) {
            if (selected.id === id) {
                setSelected(null)
            } else {
                setSelected({ side, id, index })
            }
            return
        }

        setSelected(null)

        if (selected.id === id) {
            const firstIndex = selected.side === "russian" ? selected.index : index
            const secondIndex = selected.side === "russian" ? index : selected.index
            ref.current?.deletePair(id,  firstIndex, secondIndex)

            setPairs(prev => {
                const sorted = [...prev].sort((a, b) => a.shows - b.shows).filter(pair => pair.shows > 0)
                const pairToShowIndex = sorted.length - 1
                const pairToShow = sorted[pairToShowIndex]
                if (!pairToShow) return prev

                const updatedPairToShow = { ...pairToShow, shows: pairToShow.shows - 1 }

                ref.current?.addPair(updatedPairToShow)

                return [
                    ...prev.filter(pair => pair.id !== pairToShow.id),
                    updatedPairToShow
                ]
            })

            setStats(prev => ({
                ...prev,
                correctCount: prev.correctCount + 1,
                turn: prev.turn + 1
            }))
            return
        }

        setStats(prev => ({
            ...prev,
            correctCount: prev.correctCount,
            turn: prev.turn + 1
        }))
    }

    useEffect(() => {
        if (stats.totalCount || !pairs.length) return

        const totalCount = pairs.reduce((acc, pair) => acc + pair.shows, 0)
        setStats({ ...stats, totalCount })
    }, [pairs, stats, loading, error])

    const [hasWords, setHasWords] = useState(true)

    useEffect(() => {
        if (ref.current?.hasWords) {
            setHasWords(ref.current.hasWords())
        }
    }, [pairs, stats.turn])

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    if (error) return <div className="flex items-center justify-center h-screen">Error</div>

    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-6 mb-1">
                <h2 className="text-lg font-bold text-gray-800">🧩 Сопоставление пар</h2>
            </div>

            <WordListsBlock
                pairs={pairs}
                onWordClick={handleWordClick}
                selected={selected}
                ref={ref}
            />

            { !hasWords && (
                <div className="flex justify-center">
                    <Button className="px-10 py-2 text-base mt-1" onClick={reloadGame}>
                        Начать заново
                    </Button>
                </div>
            )}

            <StatsWidget stats={stats} hasWords={hasWords} />
        </div>
    )
}
