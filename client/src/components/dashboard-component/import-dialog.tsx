import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Upload, FileText, X, AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createNote } from '../../store/note-slice/notesSlice';
import type { AppDispatch, RootState } from '../../store/store';

interface ImportDialogProps {
  children: React.ReactNode;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const notes = useSelector((state: RootState) => state.notes.notes);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type === 'text/plain') {
      setSelectedFile(file);
      setError(null);
      
      // Controlla se esiste già una nota con questo nome
      const fileName = file.name.replace(/\.txt$/i, '');
      const existingNote = notes.find(note => 
        note.title.toLowerCase() === fileName.toLowerCase()
      );
      
      if (existingNote) {
        setError(`Esiste già una nota con il nome "${fileName}". Scegli un file con un nome diverso.`);
      }
    } else {
      alert('Per favore seleziona solo file .txt');
    }
  }, [notes]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const txtFile = files.find(file => file.type === 'text/plain');
    if (txtFile) {
      handleFileSelect(txtFile);
    } else {
      alert('Per favore trascina solo file .txt');
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleImport = useCallback(async () => {
    if (!selectedFile || error) return;

    try {
      const content = await selectedFile.text();
      const fileName = selectedFile.name.replace(/\.txt$/i, '');
      
      // Doppio controllo per sicurezza prima di creare la nota
      const existingNote = notes.find(note => 
        note.title.toLowerCase() === fileName.toLowerCase()
      );
      
      if (existingNote) {
        setError(`Esiste già una nota con il nome "${fileName}". Scegli un file con un nome diverso.`);
        return;
      }
      
      // Crea la nota tramite Redux thunk (invio al server)
      const result = await dispatch(createNote({
        title: fileName,
        content: content,
      }));

      // Controlla se la creazione è fallita
      if (createNote.rejected.match(result)) {
        const errorMessage = (result.payload as string) || 'Errore durante la creazione della nota';
        setError(errorMessage);
        return;
      }

      // Reset del dialog solo se tutto è andato bene
      setSelectedFile(null);
      setError(null);
      setIsOpen(false);
      
      // Reset del file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Errore durante la lettura del file:', error);
      setError('Errore durante l\'importazione del file');
    }
  }, [selectedFile, dispatch, notes, error]);

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setIsOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importa File TXT</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Messaggio di errore */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              error
                ? 'border-red-300 bg-red-50'
                : isDragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="mx-auto h-8 w-8 text-green-600" />
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="mt-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Rimuovi
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">
                    Trascina qui il tuo file TXT
                  </p>
                  <p className="text-xs text-gray-500">
                    oppure clicca per selezionare
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* File Input Hidden */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Buttons */}
          <div className="flex justify-between space-x-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleziona File
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={handleCancel}>
                Annulla
              </Button>
              <Button 
                onClick={handleImport}
                disabled={!selectedFile || !!error}
                className="bg-primary"
              >
                Importa
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};