import express from 'express';
import {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote
} from '../../controllers/note/note-controller';
import { authMiddleware } from '../../controllers/auth/auth-controller';

const router = express.Router();

// Tutte le rotte richiedono autenticazione
router.use(authMiddleware);

router.post('/', createNote);          // Create note
router.get('/', getNotes);             // Get all notes of logged user
router.get('/:id', getNote);           // Get single note
router.put('/:id', updateNote);        // Update note
router.delete('/:id', deleteNote);     // Delete note

export default router;
