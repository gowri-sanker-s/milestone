import Featured from "@/components/pageComponents/home/Featured";
import Spotlight from "@/components/pageComponents/home/Spotlight";
import Testimonial from "@/components/pageComponents/home/Testimonial";
import WhoWeAre from "@/components/pageComponents/home/WhoWeAre";

const Home = () => {


  return (
    <div>
      <Spotlight />
      <WhoWeAre />
      <Featured />
      <Testimonial />
    </div>
  )
}

export default Home