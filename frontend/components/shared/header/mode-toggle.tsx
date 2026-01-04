'use client'
import { useTheme } from "next-themes"

const ModeToggle = () => {
    const { theme, setTheme } = useTheme()
    return (
        <div>mode-toggle</div>
    )
}

export default ModeToggle