import { getLatestProducts } from "@/lib/actions/product.action"

const Home = async () => {

  const latestProducts = await getLatestProducts();

  console.log(latestProducts);

  return (
    <div>Home</div>
  )
}

export default Home