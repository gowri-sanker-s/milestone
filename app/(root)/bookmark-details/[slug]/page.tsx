import AddToCart from "@/components/shared/product/add-cart-button";
import { getMyCart } from "@/lib/actions/cart.action";
import { getBookmarkBySlug } from "@/lib/actions/bookmark.action";
import { oleo } from "@/lib/fonts";
import { Heart, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bookmark = await getBookmarkBySlug(slug);

  if (!bookmark) {
    return {
      title: "Bookmark Not Found - Milestone Books",
    };
  }

  return {
    title: `${bookmark.name} - Milestone Books`,
    description: bookmark.description,
  };
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  const bookmark = await getBookmarkBySlug(slug);
  const cart = await getMyCart();

  if (!bookmark) return notFound();

  return (
    <div>
      <div className="wrapper pt-15">
        <div className="top lg:sticky top-[120px] z-0 grid justify-items-center lg:flex gap-10 items-center">
          <div className="left">
            <div className="img-wrapper p-10 rounded-3xl bg-primary-border">
              <div className="img-container w-[200px] h-[300px] sm:w-[280px] sm:h-[400px] overflow-clip rounded-2xl bg-primary-bg">
                <img
                  src={bookmark.images[0] ?? "/placeholder-book.jpg"}
                  alt={bookmark.name}
                  className="img w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="right flex-1 text-primary-text">
            <span className="text-[14px] font-bold opacity-60 leading-none tracking-wider uppercase">
              Milestone Accessories
            </span>
            <h1 className="text-[30px] md:text-[45px] font-extrabold mb-5 max-w-[80%] leading-[1] mt-2">
              {bookmark.name}
            </h1>
            <div className="flex flex-wrap gap-3 items-center text-[15px] font-medium">
              <div className="bg-primary-border p-1 px-4 rounded-full">
                Dimensions: {bookmark.width && bookmark.height ? `${bookmark.width} x ${bookmark.height} cm` : "Standard Size"}
              </div>
              <div className="bg-primary-border p-1 px-4 rounded-full">
                {bookmark.stock > 0 ? `${bookmark.stock} In Stock` : "Out of Stock"}
              </div>
            </div>
            
            <p className="text-[13px] pt-8 pb-3 font-semibold opacity-60 leading-none uppercase">
              PRICE
            </p>
            <h1 className="text-[35px] font-extrabold max-w-[60%]">
              ₹ {bookmark.price}
            </h1>
            <div className="flex flex-wrap gap-5 items-center mt-5">
              <AddToCart
                cart={cart}
                item={{
                  productId: bookmark.id,
                  name: bookmark.name,
                  slug: bookmark.slug,
                  qty: 1,
                  price: bookmark.price,
                  image: bookmark.images[0],
                }}
              />

              <button className="flex gap-2 items-center bg-primary-border text-primary-text px-8 py-2 rounded-full font-semibold hover:bg-primary-border/80 transition-colors">
                Buy Now
              </button>
              <button className="flex gap-2 items-center bg-primary-border text-primary-text p-2 rounded-full font-semibold hover:bg-primary-border/80 transition-colors">
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
            {bookmark.description}
          </p>
          <p className="py-5 text-[15px] font-semibold opacity-60 leading-1 text-primary-bg uppercase">
            Product Images
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
            {bookmark.images.map((image, index) => (
              <div
                key={index}
                className="img-container rounded-2xl overflow-clip w-[250px] h-[400px]"
              >
                <img
                  src={image}
                  alt={bookmark.name}
                  className="img aspect-[9/16] object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
