import Image from "next/image"
import spotlightImg from "@/assets/images/home/spotlight.png";

const Spotlight = () => {
    return (
        <div className="grid lg:flex gap-10 items-center wrapper py-15 md:py-40">
            <div className="left flex-1">
                <span className="rounded-full text-[12px] bg-primary-border p-2 px-6">Effortless Reading. Fast Delivery.</span>
                <h1 className="text-[50px] sm:text-[60px] md:text-[80px] font-extrabold leading-none py-2">Peace of Mind, <br /> Delivered to Your Door.</h1>
                <p>Why wait for inspiration? Enjoy a hassle-free shopping experience with lightning-fast delivery on titles that ground and inspire you.</p>
                <div className="flex gap-8 items-center mt-7">
                    <button className="p-2.5 px-5 rounded-full bg-primary-text text-white min-w-[150px] font-semibold">Shop Now</button>
                    <button className="p-2.5 px-5 rounded-full bg-primary-border font-semibold">How We Deliver</button>
                </div>
            </div>
            <div className="right lg:h-[400px] lg:w-[650px] ">
                <Image src={spotlightImg} alt="Milestone Books" loading="lazy" fetchPriority="high" className="img" />
            </div>
        </div>
    )
}

export default Spotlight