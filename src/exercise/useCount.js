import { useState } from "react"


export const useCount = (initialCount) => {
    const [count, useCount] = useState(initialCount)

    return [count, setCount]
}