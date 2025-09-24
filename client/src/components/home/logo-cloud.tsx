import { HTMLAttributes } from "react";


function LogoCloud(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props} className="my-32 flex flex-row items-center text-center gap-6 align-middle justify-center flex-wrap mx-0 auto">
            <p className="mb-0">Trusted by engineers at</p>
            <div className="flex items-center justify-center flex-wrap gap-4 text-muted-foreground">
                
                <img src="https://res.cloudinary.com/ddalfn2r7/image/upload/v1758745004/NVIDIA-logo_degdgt.png" alt="" height={50} width={150}/>
                <img src="https://res.cloudinary.com/ddalfn2r7/image/upload/v1758745004/cursor_lmkuvr.avif" alt="" height={50} width={150}/>
                <img src="https://res.cloudinary.com/ddalfn2r7/image/upload/v1758745004/Perplexity_AI_logo.svg_fhz2xy.png" alt="" height={50} width={150}/>
                <img src="https://res.cloudinary.com/ddalfn2r7/image/upload/v1758745003/OpenAI-black-wordmark-cropped_xnaio0.avif" alt="" height={40} width={130}/>
                
            </div>
        </div>
    );
}

export default LogoCloud;