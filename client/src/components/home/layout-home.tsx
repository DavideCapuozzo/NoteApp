import MenuHome from "./menu-home";
import LogoCloud from "./logo-cloud";
import Testimonials from "./testimonials";


export default function LayoutHome() {
    return (
        <div className="flex flex-col bg-[#fdfdfc] justify-center">
            <MenuHome />
            <div className="flex-grow">
                <h1>Notebooks, but smarter.</h1>
                <p> Write, import .txt files, chat with AI, and always download your notes with a single click.</p>
                <button className="px-4 py-2 bg-[#2FCCC3] text-white rounded hover:bg-[#26b2ad] transition">Try It Free</button>
            </div>
            <div className="flex justify-center items-center align-middle">

                <video
                    src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1758744851/VideoHomeBanner_ygg3b1.mp4"
                    className="inset-0 h-[60%] w-[60%] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                    autoPlay
                    loop
                    muted
                    playsInline
                />

            </div>

            <LogoCloud />

            <div className="flex flex-col bg-gray-100 items-center align-middle py-10">
                <div className="flex flex-row max-w-[900px] w-full py-10">
                    <h3 className="text-left w-full">Integrated AI Chat</h3>
                </div>
                <div className="flex flex-row justify-center items-center align-middle">

                    <video
                        src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1758744851/VideoHomeBanner_ygg3b1.mp4"
                        className="inset-0 h-[60%] w-[60%] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />

                </div>
            </div>

            <div className="flex flex-col bg-gray-100 items-center align-middle py-10">
                <div className="flex flex-row max-w-[900px] w-full py-10">
                    <h3 className="text-right w-full"> Import and Download</h3>
                </div>
                <div className="flex flex-row justify-center items-center align-middle">

                    <video
                        src="https://res.cloudinary.com/ddalfn2r7/video/upload/v1758744851/VideoHomeBanner_ygg3b1.mp4"
                        className="inset-0 h-[60%] w-[60%] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />

                </div>
            </div>
            <Testimonials />
        </div>
    );
}
