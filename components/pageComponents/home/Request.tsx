import React from 'react'
import blob from "@/assets/images/blob.svg"
import Image from 'next/image'
const Request = () => {
    return (
        <>
            <div className="img-container relative h-[450px] w-full">
                <Image
                    src={blob}
                    alt="Request a Book"
                    fill
                    className="img"
                    priority
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-1/2 text-white grid justify-items-center w-[90%]">
                    <h2 className='font-extrabold text-[30px] text-center'>Can’t Find the Book You’re Looking For?</h2>
                    <p className='md:max-w-[70%] mx-auto text-center py-3'>Looking for a rare title or a book that’s currently out of stock?
                        Tell us what you need, and we’ll do our best to source it for you.</p>
                    <button className='bg-primary-bg p-2 px-5 rounded-full text-primary-text text-[15px] font-semibold'>Contact Us</button>
                </div>
            </div>
        </>

    )
}

export default Request