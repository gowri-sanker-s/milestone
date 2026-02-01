import logo from "@/assets/images/home/logo.png"
import { Copyright, Instagram, MapPin } from "lucide-react"
import Image from "next/image"
const Footer = () => {
    return (
        <footer className="border-t border-primary-border pt-8">
            <div className="wrapper grid justify-items-center sm:flex items-center justify-between">
                <div className="img-container h-[150px] w-[150px] rounded-full overflow-clip">
                    <Image src={logo} alt="Milestone Books" className="icon" />
                </div>
                <div className="grid grid-cols-2 gap-10">
                    <ul className="">
                        <li className="font-bold text-[20px] mb-2">Quick Links</li>
                        <li className="py-1"><a href="/" >Home</a></li>
                        <li className="py-1"><a href="/" >About</a></li>
                        <li className="py-1"><a href="/" >Contact</a></li>
                    </ul>
                    <ul className="">
                        <li className="font-bold text-[20px] mb-2 ">Contact</li>
                        <li><a href="/" className="flex gap-2 items-center py-1">
                            <Instagram size={22} strokeWidth={1.8} />Instagram</a></li>
                        <li className="flex gap-2 items-center  py-1">
                            <MapPin size={22} strokeWidth={1.8} />Ernakulam, Kerala</li>

                    </ul>
                </div>
            </div>
            <div className="flex justify-center text-[14px] gap-2 font-semibold items-center border-t border-primary-border py-2">
                <Copyright size={19} strokeWidth={1.5} /> <span>{new Date().getFullYear()} Milestone Books</span>
            </div>
        </footer>
    )
}

export default Footer