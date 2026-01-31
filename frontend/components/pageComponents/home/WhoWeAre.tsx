import React from 'react'
import logo from "@/assets/images/home/logo.png"
import Image from 'next/image'
const WhoWeAre = () => {
    return (
        <>
            <div className='wrapper flex flex-col lg:flex-row gap-8 items-center py-10'>
                <div className="left flex-1">
                    <h2 className='font-extrabold text-[30px]'>Our Story</h2>
                    <p className=' py-3'>
                        Our journey began in a small sunlit room with a single shelf of carefully chosen classics. There were no algorithms, no trends to chase—only a belief that books mark milestones in our lives. The stories that stay with us, shape us, and quietly change the way we see the world. As we’ve grown, our shelves have expanded, but our purpose has not. <br /> <br />
                        We don’t follow what’s trending. Every book at Milestone. Books is selected by a human reader—someone who stayed up too late finishing the last chapter, paused over a line that felt like truth, or closed a book knowing they’d never be quite the same. Our curation is slow, deliberate, and deeply personal, because meaningful stories deserve time and care. <br /> <br />
                        <b>Milestone Books</b> is built on the belief that books are not just things we read, but moments we carry with us. Markers of where we’ve been and signposts for where we’re going next.
                    </p>
                </div>
                <div className="right h-[300px] w-[300px]">
                    <Image src={logo} alt="Milestone Books" className='icon' />
                </div>


            </div>

        </>
    )
}

export default WhoWeAre