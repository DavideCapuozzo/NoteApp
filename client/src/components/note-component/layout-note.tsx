import NoteMenu from "./menu";
import NoteInput from "./input";
import AiInput from "./ai-input";

export default function LayoutNote() {


  return (

      <div className="flex flex-col bg-[#fdfdfc] justify-center min-h-screen">
        <NoteMenu></NoteMenu>
        
        <NoteInput></NoteInput>
        
        <AiInput></AiInput>
      </div>


  )
}