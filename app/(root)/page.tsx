import Featured from "@/components/pageComponents/home/Featured";
import Combos from "@/components/pageComponents/home/Combos";
import Request from "@/components/pageComponents/home/Request";
import Spotlight from "@/components/pageComponents/home/Spotlight";
import Testimonial from "@/components/pageComponents/home/Testimonial";
import WhoWeAre from "@/components/pageComponents/home/WhoWeAre";
import FeaturedSlider from "@/components/pageComponents/home/FeaturedSlider";
import { getFeaturedProducts } from "@/lib/actions/product.action";
import { getMyCart } from "@/lib/actions/cart.action";

const Home = async () => {
  const featuredProducts = await getFeaturedProducts({ isFeatured: true });
  const cart = await getMyCart();

  return (
    <div>
      <Spotlight />
      <WhoWeAre />
      <FeaturedSlider products={featuredProducts} cart={cart} />
      <Featured />
      <Combos />
      <Testimonial />
      <Request />
    </div>
  )
}

export default Home