import { Pencil } from "lucide-react";

export default function LoadingPencil() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative w-64 h-16 flex items-center">
        {/* Linea che si disegna progressivamente */}
        <div 
          className="absolute left-0 top-1/2 h-0.5 bg-black transform -translate-y-1/2 animate-draw-line"
        />
        
        {/* Matita che si muove da sinistra a destra */}
        <div className="absolute top-1/2 transform -translate-y-1/2 animate-pencil-move">
          <Pencil className="h-8 w-8 text-black transform rotate-45" />
        </div>
      </div>
    </div>
  );
}