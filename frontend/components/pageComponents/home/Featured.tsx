import { getLatestProducts } from '@/lib/actions/product.action';
import Image from 'next/image';
import React from 'react'
import type { ProductType } from '@/types/product';

import BookCard from '@/components/shared/BookCard';
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
                        return (
                            <BookCard key={data.id} data={data} />
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Featured