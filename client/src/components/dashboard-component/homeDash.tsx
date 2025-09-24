
import { useNavigate } from "react-router-dom";


export function Home() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/note");
    };

    return (
        <div className="flex flex-col items-center justify-center cursor-pointer mt-10 md:mt-28" onClick={handleClick}>
            <h1 className="text-4xl font-bold mb-2">NoteApp</h1>
            <p className="text-gray-400 text-lg italic">Scrivi la tua idea</p>
        </div>
    );
}