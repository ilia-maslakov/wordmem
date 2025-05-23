import { WordList, type WordListRef } from "./WordList"
import type { WordPair } from "@/types/wordPair"
import type { WordSide } from "@/types/wordSide.tsx"
import type { SelectedPair } from "@/types/selectedPair.ts"
import { forwardRef, useImperativeHandle, useRef } from "react"

interface WordListsBlockProps {
    pairs: WordPair[]
    selected: SelectedPair | null
    onWordClick: (id: string, side: WordSide, index: number) => void
}

export interface WordListsBlockRef {
    deletePair: (id: string, indexA: number, indexB: number) => void
    addPair: (newPair: WordPair) => void
    hasWords: () => boolean
}

const sides: WordSide[] = ["russian", "english"]

export const WordListsBlock = forwardRef<WordListsBlockRef, WordListsBlockProps>(
    ({ pairs, onWordClick, selected }: WordListsBlockProps, ref) => {
        const refs = useRef<(WordListRef | null)[]>([])

        const bindHandleClick = (side: WordSide) => {
            return (id: string, index: number) => {
                onWordClick(id, side, index)
            }
        }

        useImperativeHandle(
            ref,
            () => ({
                deletePair: (id: string, indexA: number, indexB: number) => {
                    refs.current[0]?.deletePair(id, indexA)
                    refs.current[1]?.deletePair(id, indexB)
                },
                addPair: (newPair: WordPair) => {
                    refs.current.forEach(ref => {
                        ref?.addPair(newPair)
                    })
                },
                hasWords: () => {
                    return refs.current.some(ref => ref?.hasWords?.())
                }
            }),
            []
        )

        return (
            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto p-4">
                {sides.map((side, index) => {

                    const localSelected =
                        selected?.side === side && typeof selected?.index === "number"
                            ? {
                                id: selected.id,
                                index: selected.index
                            }
                            : {
                                id: null,
                                index: null
                            }

                    return (
                        <WordList
                            key={index}
                            ref={ref => {
                                refs.current[index] = ref
                            }}
                            side={side}
                            pairs={pairs}
                            selectedId={localSelected.id}
                            selectedIndex={localSelected.index}
                            onClick={bindHandleClick(side)}
                        />
                    )
                })}
            </div>
        )
    }
)
