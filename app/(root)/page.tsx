import Featured from "@/components/pageComponents/home/Featured";
import Combos from "@/components/pageComponents/home/Combos";
import Request from "@/components/pageComponents/home/Request";
import Spotlight from "@/components/pageComponents/home/Spotlight";
import Testimonial from "@/components/pageComponents/home/Testimonial";
import WhoWeAre from "@/components/pageComponents/home/WhoWeAre";

const Home = () => {


  return (
    <div>
      <Spotlight />
      <WhoWeAre />
      <Featured />
      <Combos />
      <Testimonial />
      <Request />
    </div>
  )
}

export default Home