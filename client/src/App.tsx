import { useEffect, useState } from "react"
import { WordCardList } from "@/components/WordCardList"
import { StatsWidget } from "@/components/StatsWidget"
import { loadUniqueWordPairs } from "@/lib/loadWordPairs"
import type { WordPair } from "@/types/wordPair"

const PAIRS = 8
type WordMatrix = (string | 0 | 1)[]

export const App = () => {
    const [matrix, setMatrix] = useState<WordMatrix>([])
    const [pool, setPool] = useState<WordPair[]>([])
    const [pairMap, setPairMap] = useState<Record<string, WordPair>>({})
    const [selected, setSelected] = useState<{ pair: WordPair; index: number } | null>(null)
    const [turn, setTurn] = useState(0)
    const [loading, setLoading] = useState(true)
    const [correctCount, setCorrectCount] = useState(0)
    const [finished, setFinished] = useState(false)

    useEffect(() => {
        const load = async () => {
            const all = await loadUniqueWordPairs(PAIRS + 5)
            const initPairs = all.slice(0, PAIRS)

            const shuffled = [...initPairs].sort(() => Math.random() - 0.5)
            const initialMatrix: WordMatrix = [...initPairs.map(p => p.id), ...shuffled.map(p => p.id)]

            const mapping: Record<string, WordPair> = {}
            all.forEach(p => {
                mapping[p.id] = p
            })

            setMatrix(initialMatrix)
            setPairMap(mapping)
            const initialPool = all.slice(PAIRS)
            console.log("🔢 Initial pool size:", initialPool.length)
            setPool(initialPool)
            setLoading(false)
        }

        load()
    }, [])

    const promoteZeros = () => {
        setMatrix(prev => {
            if (!prev.includes(0)) return prev
            return prev.map(v => (v === 0 ? 1 : v))
        })
    }

    const handleCorrectMatch = (matchedId: string) => {
        setMatrix(prev => {
            const next = [...prev]
            console.log("🔁 MATCH", matchedId)
            console.log("Matrix before:", prev)

            for (let i = 0; i < next.length; i++) {
                if (next[i] === matchedId) {
                    next[i] = 0
                    console.log(`🧹 Slot ${i} cleared`)
                }
            }

            if (next.includes(1) && pool.length > 0) {
                const newPair = pool[0]
                setPool(p => {
                    const updated = p.slice(1)
                    console.log("📉 Pool size after replacement:", updated.length)
                    return updated
                })

                const replaced = next.map(v => (v === 1 ? newPair.id : v))
                console.log("♻️ Replacing 1s with", newPair.id)
                console.log("Matrix after:", replaced)

                if (replaced.every(v => typeof v === "number" && v === 1) && pool.length === 1) {
                    setFinished(true)
                    console.log("🏁 Game finished (after replacement)")
                }

                return replaced as WordMatrix
            }

            if (next.includes(0)) {
                const updated = next.map(v => (v === 0 ? 1 : v))
                console.log("🟡 Promoting 0 → 1")
                console.log("Matrix after:", updated)

                if (updated.every(v => v === 1) && pool.length === 0) {
                    setFinished(true)
                    console.log("🏁 Game finished (after promotion)")
                }

                return updated
            }

            if (!next.includes(0) && !next.includes(1) && pool.length > 0) {
                const newPair = pool[0]
                setPool(p => {
                    const updated = p.slice(1)
                    console.log("📉 Pool size after fallback:", updated.length)
                    return updated
                })

                let inserted = 0
                const replaced = next.map(v => {
                    if ((v === 0 || v === 1) && inserted < 2) {
                        inserted++
                        return newPair.id
                    }
                    return v
                })

                console.log("🧩 Fallback replacement — filled blanks with", newPair.id)
                console.log("Matrix after:", replaced)

                return replaced as WordMatrix
            }

            if (next.every(v => v === 1) && pool.length === 0) {
                setFinished(true)
                console.log("🏁 Game finished (final check)")
            }

            console.log("✅ Matrix unchanged:", next)
            return next
        })
    }

    const handleWordClick = (pair: WordPair, side: "left" | "right") => {
        const indexOffset = side === "right" ? PAIRS : 0
        const slotList = side === "right" ? matrix.slice(PAIRS) : matrix.slice(0, PAIRS)
        const index = slotList.findIndex(v => typeof v === "string" && v === pair.id)

        if (index === -1) return
        const matrixIndex = index + indexOffset

        console.log("🖱 Клик:", pair.id, "в позиции", matrixIndex)

        if (!selected) {
            setSelected({ pair, index: matrixIndex })
            return
        }

        if (selected.pair.id === pair.id && selected.index !== matrixIndex) {
            setCorrectCount(c => c + 1)
            handleCorrectMatch(pair.id)
        }

        setSelected(null)
        setTurn(t => t + 1)
        promoteZeros()
    }

    if (loading) {
        return <div className="text-center py-10">Загрузка...</div>
    }

    if (finished) {
        return <StatsWidget correct={correctCount} total={turn} />
    }

    const left = matrix.slice(0, PAIRS).map(v => (typeof v === "string" ? pairMap[v] : null))
    const right = matrix.slice(PAIRS).map(v => (typeof v === "string" ? pairMap[v] : null))

    return (
        <WordCardList
            left={left}
            right={right}
            onWordClick={handleWordClick}
        />
    )
}
