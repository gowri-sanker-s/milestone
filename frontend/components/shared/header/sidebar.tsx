'use client'

import { useState } from "react"
const Sidebar = () => {
    const [openSidebar, setOpenSidebar] = useState(false)
    console.log(openSidebar);

    return (
        <div className="">
            <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setOpenSidebar((prev) => !prev)}
                className="relative w-8 h-8 grid items-center">
                {/* top */}
                <span
                    className={`absolute h-0.5 bg-primary-text rounded-full transition-all duration-300
      ${openSidebar ? "w-7 rotate-45" : "w-8 -translate-y-2"}
    `}
                />

                {/* middle */}
                <span
                    className={`absolute h-0.5 bg-primary-text rounded-full transition-all duration-300
      ${openSidebar ? "opacity-0 scale-x-0" : "w-5"}
    `}
                />

                {/* bottom */}
                <span
                    className={`absolute h-0.5 bg-primary-text rounded-full transition-all duration-300
      ${openSidebar ? "w-7 -rotate-45" : "w-8 translate-y-2"}
    `}
                />
            </button>
            <div className={`fixed bg-primary-border top-[61.5px] left-0 transition-translate duration-400 bg-black h-full w-full md:w-1/4 ${!openSidebar ? "-translate-x-full" : "translate-x-0"}`}></div>
        </div>
    )
}

export default Sidebar