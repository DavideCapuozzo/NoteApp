import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../lib/axios';

interface Note {
    _id: string;
    title: string;
    content: string;
    updatedAt?: string;
}

interface NotesState {
    notes: Note[];
    currentNote: Note | null;
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
    total: number;
}

const initialState: NotesState = {
    notes: [],
    currentNote: null,
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    total: 0
};

// API Base
const API_BASE = 'http://localhost:5000/api/notes';

// Async Thunks
export const fetchNotes = createAsyncThunk('notes/fetchNotes', async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const res = await axios.get(`${API_BASE}?page=${page}&limit=${limit}`, { withCredentials: true });
    return {
        notes: res.data.notes,
        hasMore: res.data.hasMore,
        total: res.data.total,
        page
    };
});

export const fetchNote = createAsyncThunk('notes/fetchNote', async (id: string) => {
    const res = await axios.get(`${API_BASE}/${id}`, { withCredentials: true });
    return res.data.note;
});

export const createNote = createAsyncThunk(
    'notes/createNote', 
    async (note: {title:string, content:string}, { rejectWithValue }) => {
        try {
            const res = await axios.post(API_BASE, note, { withCredentials: true });
            return res.data.note;
        } catch (error: any) {
            // Restituisci il messaggio di errore dal server se disponibile
            const message = error.response?.data?.message || 'Errore durante la creazione della nota';
            return rejectWithValue(message);
        }
    }
);

export const updateNote = createAsyncThunk('notes/updateNote', async ({id, note}:{id:string, note:{title:string, content:string}}) => {
    const res = await axios.put(`${API_BASE}/${id}`, note, { withCredentials: true });
    return res.data.note;
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async (id: string) => {
    await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
    return id;
});

export const resetNotesData = createAsyncThunk('notes/resetNotesData', async () => {
    await axios.delete(`${API_BASE}`, { withCredentials: true });
    return;
});


const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        clearCurrentNote: (state) => { state.currentNote = null },
        resetNotes: (state) => {
            state.notes = [];
            state.currentNote = null;
            state.loading = false;
            state.error = null;
            state.page = 1;
            state.hasMore = true;
            state.total = 0;
        }
    },
    extraReducers: (builder) => {
        builder
        // FETCH NOTES
        .addCase(fetchNotes.pending, (state) => { state.loading = true; state.error = null })
        .addCase(fetchNotes.fulfilled, (state, action) => {
            const { notes, hasMore, total, page } = action.payload;
            console.log('FETCH_NOTES_FULFILLED', { notes, hasMore, total, page });
            if (page === 1) {
                // Ordina le note per updatedAt in ordine decrescente (più recenti prima)
                state.notes = notes.sort((a: Note, b: Note) => {
                    const dateA = new Date(a.updatedAt || 0).getTime();
                    const dateB = new Date(b.updatedAt || 0).getTime();
                    return dateB - dateA;
                });
            } else {
                state.notes = [...state.notes, ...notes];
            }
            state.hasMore = hasMore;
            state.total = total;
            state.page = page;
            state.loading = false;
        })
        .addCase(fetchNotes.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null })

        // FETCH SINGLE NOTE
        .addCase(fetchNote.pending, (state) => { state.loading = true; state.error = null })
        .addCase(fetchNote.fulfilled, (state, action) => { state.currentNote = action.payload; state.loading = false })
        .addCase(fetchNote.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null })

        // CREATE NOTE
        .addCase(createNote.pending, (state) => { state.loading = true; state.error = null })
        .addCase(createNote.fulfilled, (state, action) => {
            state.notes.unshift(action.payload);
            state.currentNote = action.payload;
            state.loading = false;
        })
        .addCase(createNote.rejected, (state, action) => { 
            state.loading = false; 
            state.error = action.payload as string || action.error.message || null;
        })

        // UPDATE NOTE
        .addCase(updateNote.fulfilled, (state, action) => {
            const idx = state.notes.findIndex(n => n._id === action.payload._id);
            if(idx !== -1) {
                // Rimuovi la nota dalla posizione corrente
                state.notes.splice(idx, 1);
                // Aggiungila all'inizio (la più recente)
                state.notes.unshift(action.payload);
            }
            state.currentNote = action.payload;
        })

        // DELETE NOTE
        .addCase(deleteNote.fulfilled, (state, action) => {
            state.notes = state.notes.filter(n => n._id !== action.payload);
            if(state.currentNote?._id === action.payload) state.currentNote = null;
        })

        .addCase(resetNotesData.fulfilled, (state) => {
            state.notes = [];
            state.currentNote = null;
            state.loading = false;
            state.error = null;
            state.page = 1;
            state.hasMore = true;
            state.total = 0;
        });
    }
});

export const { clearCurrentNote, resetNotes } = notesSlice.actions;
export default notesSlice.reducer;
