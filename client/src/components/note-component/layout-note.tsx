import NoteMenu from "./menu";
import NoteInput from "./input";
import AiInput from "./ai-input";

export default function LayoutNote() {


  return (

      <div className="flex flex-col bg-[#fdfdfc] justify-center">
        <NoteMenu />
        <NoteInput />
        <AiInput />
      </div>


  )
}