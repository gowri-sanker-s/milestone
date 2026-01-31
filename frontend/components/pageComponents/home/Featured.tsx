import { getLatestProducts } from '@/lib/actions/product.action';
import Image from 'next/image';
import React from 'react'
import type { ProductType } from '@/types/product';
import addCart from "@/assets/images/add_cart.png"
import removeCart from "@/assets/images/remove_cart.png"
const Featured = async () => {

    const latestProducts: ProductType[] = await getLatestProducts({
        isFeatured: true,
    });

    console.log(latestProducts);
    return (
        <>
            <div className='wrapper py-10'>
                <h2 className='font-extrabold text-[30px] text-center'>Featured Books</h2>
                <p className='md:max-w-[70%] mx-auto text-center py-3'>Explore our handpicked collection of bestsellers, latest arrivals, and timeless classics. From thrilling novels to insightful non-fiction, we have something for every reader. Browse through our categories and find your next great read today!</p>
                <div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
                    {latestProducts && latestProducts.map((data, index) => {
                        return (<div key={data.id} className='bg-primary-border p-3 rounded-2xl flex flex-col'>
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
                        </div>)
                    })}
                </div>
            </div>
        </>
    )
}

export default Featured