import { useState } from "react";
import NoteMenu from "./menu";
import NoteInput from "./input";
import AiInput from "./ai-input";

export default function LayoutNote() {
  const [aiInputHeight, setAiInputHeight] = useState(150);

  return (
    <div className="flex flex-col bg-[#fdfdfc] justify-center">
      <NoteMenu />
      <NoteInput aiInputHeight={aiInputHeight} />
      <AiInput onHeightChange={setAiInputHeight} />
    </div>
  );
}