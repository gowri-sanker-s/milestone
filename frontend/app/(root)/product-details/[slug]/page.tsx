import { getProductBySlug } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;  

  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  console.log(slug);
  console.log(product);

  return (
    <div>
      {/* <h1>{product.name}</h1>
      <p>₹ {product.price}</p> */}
    </div>
  );
};

export default Page;