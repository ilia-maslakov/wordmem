import {stringToColor} from "@/utils/stringToColor.ts";
import {cn} from "@/lib/utils.ts";


interface WordButtonProps {
    word: string
    id: string
    onClick: (id: string) => void
    isSelected: boolean
}

export const WordButton = ({word, id, onClick, isSelected}: WordButtonProps) => {
    const color = stringToColor(id)

    const handleClick = () => onClick(id)
    const selectedClass = isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-gray-300"


    return (
        <div
            onClick={handleClick}
            className={cn('text-center h-full rounded-lg content-center text-gray-400 transition duration-200', selectedClass)}
            style={{color: color }}
        >
            {word}
        </div>
    )
}