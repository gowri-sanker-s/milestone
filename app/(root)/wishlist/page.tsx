import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { auth } from "@/auth";
import { getWishlist } from "@/lib/actions/wishlist.action";
import { getMyCart } from "@/lib/actions/cart.action";
import { formatCurrency, formatId } from "@/lib/utils";
import AddToCart from "@/components/shared/product/add-cart-button";
import WishlistButton from "@/components/shared/product/wishlist-button";
import { funnel, oleo } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Your Wishlist - Milestone Books",
  description: "Your saved books and bookmarks.",
};

const WishlistPage = async () => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in?callbackUrl=/wishlist");
  }

  const wishlist = await getWishlist();
  const cart = await getMyCart();

  return (
    <div className="wrapper py-12 min-h-[70vh]">
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-sm font-semibold tracking-wider uppercase opacity-75">
          Saved Items
        </span>
        <h1 className={`${oleo.className} text-4xl md:text-5xl font-extrabold text-primary-text`}>
          Your Wishlist
        </h1>
        <p className="text-md opacity-80 max-w-2xl leading-relaxed">
          Manage your personal collection of books and bookmarks. Add them to your cart when you are ready to check out, or remove them at any time.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 border border-dashed border-primary-text/20 rounded-3xl max-w-2xl mx-auto bg-primary-border/10">
          <div className="w-16 h-16 rounded-full bg-primary-border/60 flex items-center justify-center text-primary-text">
            <ShoppingBag size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className={`${funnel.className} text-xl font-bold text-primary-text`}>
              Your Wishlist is Empty
            </h3>
            <p className="text-sm opacity-60 max-w-xs mt-2 mx-auto">
              Browse our catalog of curated books and accessories, and save your favorites here.
            </p>
          </div>
          <Link
            href="/books"
            className="bg-primary-text text-white font-bold rounded-full py-2.5 px-6 hover:opacity-90 transition-opacity text-sm inline-block"
          >
            Explore Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
          {wishlist.map((product) => {
            const isBook = product.kind === "book";
            const detailUrl = isBook ? `/book-details/${product.slug}` : `/bookmark-details/${product.slug}`;

            return (
              <div
                key={product.id}
                className="bg-primary-border p-3 rounded-2xl flex flex-col justify-between group/card border border-primary-text/5 relative"
              >
                {/* Wishlist toggle button at the top corner */}
                <div className="absolute top-4 right-4 z-10">
                  <WishlistButton
                    productId={product.id}
                    initialIsInWishlist={true}
                    authenticated={true}
                    slug={product.slug}
                    kind={product.kind}
                  />
                </div>

                <Link href={detailUrl} className="flex flex-col h-full justify-between">
                  <div>
                    {/* Image Container */}
                    <div className="img-container rounded-2xl overflow-clip aspect-[4/5] bg-primary-bg relative">
                      <img
                        src={product.images[0] ?? "/placeholder-book.jpg"}
                        alt={product.name}
                        className="img w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                      />
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-[#b04a26] text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider z-1">
                          Limited Stock
                        </span>
                      )}
                      {product.stock <= 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-neutral-700 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider z-10">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Details Info */}
                    <div className="details pt-4">
                      <p className="text-[12px] opacity-60 capitalize font-semibold tracking-wider">
                        {isBook
                          ? product.author ? String(product.author).toLowerCase() : "Author"
                          : "Milestone Accessory"}
                      </p>
                      <h3 className="font-extrabold text-[18px] leading-snug text-primary-text line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                      <p className="text-[13px] py-1.5 opacity-70 text-primary-text/80 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Buy / Cart Section */}
                  <div className="border-t border-primary-bg/10 pt-3 mt-4 flex gap-3 items-center justify-between font-semibold text-[16px] w-full self-end">
                    <span className="text-primary-text">{formatCurrency(product.price)}</span>
                    <AddToCart
                      cart={cart}
                      variant="compact"
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        qty: 1,
                        price: product.price,
                        image: product.images[0],
                      }}
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
