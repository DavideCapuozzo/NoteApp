import { Request, Response } from 'express';
const Note = require ('../../models/Note');

// CREATE NOTE
export const createNote = async (req: any, res: Response) => {
    try {
        const { title, content } = req.body;
        
        // Controlla se esiste già una nota con lo stesso titolo per questo utente
        const existingNote = await Note.findOne({ 
            title: title, 
            createdBy: req.user.id 
        });
        
        if (existingNote) {
            return res.status(400).json({ 
                success: false, 
                message: `Esiste già una nota con il nome "${title}". Scegli un titolo diverso.` 
            });
        }
        
        const newNote = new Note({
            title,
            content,
            createdBy: req.user.id
        });
        await newNote.save();
        res.status(201).json({ success: true, note: newNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error creating note' });
    }
};

// GET ALL NOTES OF USER
export const getNotes = async (req: any, res: Response) => {
    try {
        // Paginazione classica: page e limit dalla query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Conta tutte le note dell'utente
        const total = await Note.countDocuments({ createdBy: req.user.id });

        // Prendi solo le note richieste
        const notes = await Note.find({ createdBy: req.user.id })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        // Flag se ci sono altre note
        const hasMore = skip + notes.length < total;

        res.status(200).json({ success: true, notes, hasMore, total });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching notes' });
    }
};

// GET SINGLE NOTE
export const getNote = async (req: any, res: Response) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, createdBy: req.user.id });
        if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
        res.status(200).json({ success: true, note });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching note' });
    }
};

// UPDATE NOTE
export const updateNote = async (req: any, res: Response) => {
    try {
        const { title, content } = req.body;
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { title, content },
            { new: true }
        );
        if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
        res.status(200).json({ success: true, note });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error updating note' });
    }
};

// DELETE NOTE
export const deleteNote = async (req: any, res: Response) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
        res.status(200).json({ success: true, message: 'Note deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error deleting note' });
    }
};


