
const { createNote, getNotes, getNote, updateNote, deleteNote } = require('../../controllers/note/note-controller');
import express from 'express';
const router = express.Router();

import {authMiddleware} from '../../controllers/auth/auth-controller';

// Tutte le rotte richiedono autenticazione
router.use(authMiddleware);

router.post('/', createNote);          // Create note
router.get('/', getNotes);             // Get all notes of logged user
router.get('/:id', getNote);           // Get single note
router.put('/:id', updateNote);        // Update note
router.delete('/:id', deleteNote);     // Delete note

export default router;