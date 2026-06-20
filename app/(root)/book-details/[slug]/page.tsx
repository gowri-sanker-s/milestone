import AddToCart from "@/components/shared/product/add-cart-button";
import { getMyCart } from "@/lib/actions/cart.action";
import { getProductBySlug } from "@/lib/actions/product.action";
import { oleo } from "@/lib/fonts";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  const cart = await getMyCart();

  if (!product) return notFound();

  // Fetch books in the combo if kind is combo
  let comboBooks: any[] = [];
  if (product.kind === "combo" && product.bookIds && product.bookIds.length > 0) {
    comboBooks = await prisma.product.findMany({
      where: {
        id: { in: product.bookIds },
      },
    });
  }

  return (
    <div>
      <div className="wrapper pt-15 font-normal">
        <div className="top lg:sticky top-[120px] z-0 grid justify-items-center lg:flex  gap-10 items-center">
          <div className="left">
            <div className="img-wrapper p-10 rounded-3xl bg-primary-border">
              <div className="img-container w-[200px] h-[300px] sm:w-[280px] sm:h-[400px] overflow-clip rounded-2xl">
                <img
                  src={product.images[0] ?? "/placeholder-book.jpg"}
                  alt={product.name}
                  className="img aspect-[4/5]"
                />
              </div>
            </div>
          </div>
          <div className="right flex-1">
            {product.author && (
              <p className="text-[14px] font-bold opacity-60 leading-1 capitalize">
                {String(product.author).toLowerCase()}
              </p>
            )}
            {product.kind === "combo" && (
              <p className="text-[14px] font-bold opacity-60 leading-1 capitalize">
                Special Combo Offer
              </p>
            )}
            <h1 className="text-[30px] md:text-[45px] font-extrabold mb-5 max-w-[80%] leading-[1] mt-2">
              {product.title}
            </h1>
            <div className="flex flex-wrap gap-3 items-center text-[15px] font-medium">
              {product.pages && product.pages > 0 && (
                <div className="bg-primary-border p-1 px-4 rounded-full">
                  {product.pages} pages
                </div>
              )}
              {product.language && (
                <div className="bg-primary-border p-1 px-4 rounded-full">
                  {product.language}
                </div>
              )}
              <div className="bg-primary-border p-1 px-4 rounded-full flex items-center gap-2">
                <span className="icon-star  text-[#0000003a]">
                  <Star size={15} fill="#ffc400cf" />
                </span>
                {product.rating} ({product.reviewsCount} reviews)
              </div>
            </div>
            {product.genres && product.genres.length > 0 && (
              <>
                <p className="text-[13px] pt-8 pb-5 font-semibold opacity-60 leading-1 ">
                  GENRES
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.genres.map((genre, index) => (
                    <div
                      key={index}
                      className="bg-primary-border p-1 px-4 rounded-full text-[15px] font-medium"
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              </>
            )}
            <p className="text-[13px] pt-8 pb-3 font-semibold opacity-60 leading-1 ">
              PRICE
            </p>
            <h1 className="text-[35px] font-extrabold max-w-[60%]">
              ₹ {product.price}
            </h1>
            <div className="flex flex-wrap gap-5 items-center mt-5">
              <AddToCart
                cart={cart}
                item={{
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  qty: 1,
                  price: product.price,
                  image: product.images[0],
                }}
              />

              <button className="flex gap-2 items-center bg-primary-border text-primary-text px-8 py-2 rounded-full font-semibold">
                Buy Now
              </button>
              <button className="flex gap-2 items-center bg-primary-border text-primary-text p-2 rounded-full font-semibold">
                <Heart size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
        <div className="bottom relative z-1 bg-primary-text p-10 rounded-t-3xl mt-10">
          <h3
            className={`${oleo.className} text-[40px] text-primary-bg mb-10 tracking-wide`}
          >
            Details & Description
          </h3>
          <p className="text-[15px] font-semibold opacity-60 leading-1 text-primary-bg uppercase">
            Description
          </p>
          <p className="py-5 font-semibold text-primary-bg text-[20px] leading-snug">
            {product.description}
          </p>

          {/* Render books in this combo if it is a combo offer */}
          {comboBooks && comboBooks.length > 0 && (
            <div className="mt-10 mb-10 pt-8 border-t border-primary-bg/10">
              <h3 className={`${oleo.className} text-[35px] text-primary-bg mb-6 tracking-wide`}>
                Books Included in this Combo
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 font-normal">
                {comboBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/book-details/${book.slug}`}
                    className="bg-primary-bg/10 hover:bg-primary-bg/15 border border-primary-bg/10 p-3 rounded-2xl flex flex-col group/card transition-colors"
                  >
                    <div className="img-container rounded-xl overflow-clip bg-primary-bg/5">
                      <img
                        src={book.images[0] ?? "/placeholder-book.jpg"}
                        alt={book.name}
                        className="img aspect-[4/5] transition-transform duration-300 group-hover/card:scale-105 mx-auto"
                      />
                    </div>
                    <div className="pt-3 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[12px] opacity-75 capitalize truncate text-primary-bg">
                          {book.author ? String(book.author).toLowerCase() : ""}
                        </p>
                        <h4 className="font-bold text-[16px] text-primary-bg leading-tight truncate mt-1">
                          {book.name}
                        </h4>
                      </div>
                      <span className="text-[15px] font-bold text-primary-bg mt-2 block">
                        ₹ {book.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {product.kind !== "combo" && (
            <>
              <p className=" py-5 text-[15px] font-semibold opacity-60 leading-1 text-primary-bg uppercase">
                Product Images
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="img-container rounded-2xl overflow-clip w-[250px] h-[400px]"
                  >
                    <img
                      src={image}
                      alt={product.name}
                      className="img aspect-[9/16]"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
