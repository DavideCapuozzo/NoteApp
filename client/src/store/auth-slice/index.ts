import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null
}

export const registerUser = createAsyncThunk("/auth/registration",
    async(formData) => {
        //in quanto ho indicato nel mio server>server.js la porta 5000 e il resto del percorso e' 
        // quello inserito sempre nello stesso file che mi permette di accedere alle routes quindi 
        // andro a completare il mio link con register che 'e la route 
        // che mi permette di accedere al controller 
        const response = await axios.post(`http://localhost:5000/api/auth/registration`, formData, {
            withCredentials: true
        });

        return response.data;
    }

)
export const loginUser = createAsyncThunk("/auth/login",
    async(formData) => {
        //in quanto ho indicato nel mio server>server.js la porta 5000 e il resto del percorso e' 
        // quello inserito sempre nello stesso file che mi permette di accedere alle routes quindi 
        // andro a completare il mio link con register che 'e la route 
        // che mi permette di accedere al controller 
        const response = await axios.post(`http://localhost:5000/api/auth/login`, formData, {
            withCredentials: true
        });

        return response.data;
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false
            })
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer