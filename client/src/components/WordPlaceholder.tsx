import type {ReactNode} from "react";

interface WordPlaceholderProps {
    children: ReactNode
}


export const WordPlaceholder = ({children}: WordPlaceholderProps) => {
    return (
        <div className="border cursor-pointer h-[60px] rounded-lg w-full">
            {children}
        </div>
    )
}