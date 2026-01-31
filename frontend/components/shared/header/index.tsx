import { oleo } from "@/lib/fonts"
import ModeToggle from "./mode-toggle"
import Sidebar from "./sidebar"

const Header = () => {
    return (
        <header className=" text-primary-text  border-b border-primary-border py-1 sticky top-0">
            <div className="flex justify-between items-center wrapper">
                {/* open toggle */}
                <Sidebar />
                {/* logo */}
                <div className={`${oleo.className} text-[25px] md:text-[35px] justify-self-center `}>milestone books</div>
                {/* empty */}
                <div className="invisible">s</div>
                {/* <ModeToggle /> */}
            </div>
        </header>
    )
}

export default Header