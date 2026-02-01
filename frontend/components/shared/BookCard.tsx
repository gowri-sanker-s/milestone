import React from 'react'
import addCart from "@/assets/images/add_cart.png"
import removeCart from "@/assets/images/remove_cart.png"
import Image from 'next/image'
import { ProductType } from '@/types/product'

type BookCardProps = {
    data: ProductType;
};
const BookCard = ({ data }: BookCardProps) => {
    return (
        <div key={data.id} className='bg-primary-border p-3 rounded-2xl flex flex-col'>
            <div className="img-container rounded-2xl overflow-clip">
                <img src={data.banner ?? '/placeholder-book.jpg'} alt={data.name} className="img aspect-[4/5]" />
            </div>
            <div className="details grid pt-4 flex-1">
                <p className='text-[13px]  capitalize leading-tight'>{String(data.author).toLocaleLowerCase()}</p>
                <h3 className='font-extrabold text-[19px] leading-tight'>{data.name}</h3>
                <p className='text-[15px] py-2'>{String(data.description).slice(0, 80)}...</p>
                {/* rating */}
                <div className="border-t border-primary-bg pt-3 self-end flex gap-3 items-center justify-between">
                    <span>
                        ₹ {data.price}
                    </span>
                    <span className='img-container h-7 w-7 rounded-full'>
                        <Image src={addCart} alt="Add to cart" className="icon hover:scale-[1.05] cursor-pointer transition-scale duration-300" />
                    </span>

                </div>
            </div>
        </div>
    )
}

export default BookCard