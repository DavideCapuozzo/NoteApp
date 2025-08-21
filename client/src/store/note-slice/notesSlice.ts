import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Note {
    _id: string;
    title: string;
    content: string;
}

interface NotesState {
    notes: Note[];
    currentNote: Note | null;
    loading: boolean;
    error: string | null;
}

const initialState: NotesState = {
    notes: [],
    currentNote: null,
    loading: false,
    error: null
};

// API Base
const API_BASE = 'http://localhost:5000/api/notes';

// Async Thunks
export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const res = await axios.get(API_BASE, { withCredentials: true });
    return res.data.notes;
});

export const fetchNote = createAsyncThunk('notes/fetchNote', async (id: string) => {
    const res = await axios.get(`${API_BASE}/${id}`, { withCredentials: true });
    return res.data.note;
});

export const createNote = createAsyncThunk('notes/createNote', async (note: {title:string, content:string}) => {
    const res = await axios.post(API_BASE, note, { withCredentials: true });
    return res.data.note;
});

export const updateNote = createAsyncThunk('notes/updateNote', async ({id, note}:{id:string, note:{title:string, content:string}}) => {
    const res = await axios.put(`${API_BASE}/${id}`, note, { withCredentials: true });
    return res.data.note;
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async (id: string) => {
    await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
    return id;
});

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        clearCurrentNote: (state) => { state.currentNote = null }
    },
    extraReducers: (builder) => {
        builder
        // FETCH NOTES
        .addCase(fetchNotes.pending, (state) => { state.loading = true; state.error = null })
        .addCase(fetchNotes.fulfilled, (state, action) => { state.notes = action.payload; state.loading = false })
        .addCase(fetchNotes.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null })

        // FETCH SINGLE NOTE
        .addCase(fetchNote.pending, (state) => { state.loading = true; state.error = null })
        .addCase(fetchNote.fulfilled, (state, action) => { state.currentNote = action.payload; state.loading = false })
        .addCase(fetchNote.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null })

        // CREATE NOTE
        .addCase(createNote.fulfilled, (state, action) => { state.notes.unshift(action.payload); state.currentNote = action.payload })

        // UPDATE NOTE
        .addCase(updateNote.fulfilled, (state, action) => {
            const idx = state.notes.findIndex(n => n._id === action.payload._id);
            if(idx !== -1) state.notes[idx] = action.payload;
            state.currentNote = action.payload;
        })

        // DELETE NOTE
        .addCase(deleteNote.fulfilled, (state, action) => {
            state.notes = state.notes.filter(n => n._id !== action.payload);
            if(state.currentNote?._id === action.payload) state.currentNote = null;
        })
    }
});

export const { clearCurrentNote } = notesSlice.actions;
export default notesSlice.reducer;
