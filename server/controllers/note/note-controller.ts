import { Request, Response } from 'express';
const Note = require ('../../models/Note');

// CREATE NOTE
export const createNote = async (req: any, res: Response) => {
    try {
        const { title, content } = req.body;
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
        const notes = await Note.find({ createdBy: req.user.id }).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, notes });
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


