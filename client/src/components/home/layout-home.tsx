import MenuHome from "./menu-home";
import LogoCloud from "./logo-cloud";
import Testimonials from "./testimonials";
import CTABanner from "./cta-banner";
import { FooterHome } from "./footer";
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom";


export default function LayoutHome() {
    return (
        <div className="flex flex-col bg-[#fdfdfc] justify-center">
            <MenuHome />
            <div className="flex-grow my-24 h-[400px] md:h-auto flex flex-col justify-center items-center">
                <h1 className="text-5xl md:text-7xl font-bold text-center tracking-tight px-6 pb-2.5">Notebooks, but smarter.</h1>
                <p className="mb-12 text-center"> Write, import .txt files, chat with AI, and always download your notes with a single click.</p>
                <button className="px-4 py-2 bg-[#2FCCC3] text-white rounded hover:bg-[#26b2ad] transition"><Link className="!text-white" to="/auth/login">
                        Try It Free
                    </Link></button>
            </div>
            <div className="flex flex-row justify-center items-center align-middle">
                {/* Video Desktop */}
                <video
                    src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1758744851/VideoHomeBanner_ygg3b1.mp4"
                    className="hidden md:block inset-0 h-[600px] w-[1000px] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                {/* Video Mobile */}
                <video
                    src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1759348976/VideoHomeBannerMobile_kcfgck.mp4"
                    className="block md:hidden inset-0 h-[900px] w-[400px] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </div>

            <LogoCloud />

            <div className="flex flex-col bg-gray-100 items-center align-middle pb-10 pt-14">
                <div className="flex flex-row max-w-[900px] w-full mb-12">
                    <h3 className="text-center md:text-left w-full text-2xl md:text-3xl font-bold tracking-tight">Integrated AI Chat</h3>
                </div>
                <div className="flex flex-row justify-center items-center align-middle">
                    {/* Video Desktop */}
                    <video
                        src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1759346773/chatAi_bassa_t6jwit.mp4"
                        className="hidden md:block inset-0 h-[600px] w-[1000px] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    {/* Video Mobile */}
                    <video
                        src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1759348701/ai-chatMobile_bo3wmo.mp4"
                        className="block md:hidden inset-0 h-[900px] w-[400px] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
            </div>

            <div className="flex flex-col bg-gray-100 items-center align-middle pt-10 pb-14">
                <div className="flex flex-row max-w-[900px] w-full my-12">
                    <h3 className="text-center md:text-left w-full text-2xl md:text-3xl font-bold tracking-tight">Import and Download</h3>
                </div>
                <div className="flex flex-row justify-center items-center align-middle">
                    {/* Video Desktop */}
                    <video
                        src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1759346764/import_bassa_ohr4da.mp4"
                        className="hidden md:block inset-0 h-[600px] w-[1000px] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    {/* Video Mobile */}
                    <video
                        src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1759348542/importMobile_vrwbi2.mp4"
                        className="block md:hidden inset-0 h-[900px] w-[400px] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
            </div>

            <Testimonials />

            <CTABanner />

            <Separator/>

            <FooterHome />

        </div>
    );
}
