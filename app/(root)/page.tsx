import Featured from "@/components/pageComponents/home/Featured";
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
      <Testimonial />
      <Request />
    </div>
  )
}

export default Home