import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

interface User {
    _id: string;
    userName: string;  // Cambiato da username a userName per matchare il database
    email: string;
    avatar?: string;
    authProvider?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
}

interface LoginFormData {
    email: string;
    password: string;
}

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
}

export const registerUser = createAsyncThunk("/auth/registration",
    async(formData: RegisterFormData) => {
        const response = await axios.post(`http://localhost:5000/api/auth/registration`, formData, {
            withCredentials: true
        });

        return response.data;
    }
)

export const loginUser = createAsyncThunk("/auth/login",
    async(formData: LoginFormData) => {
        const response = await axios.post(`http://localhost:5000/api/auth/login`, formData, {
            withCredentials: true
        });

        return response.data;
    }
)

export const checkAuth = createAsyncThunk("/auth/checkauth",
    async() => {
        //in quanto ho indicato nel mio server>server.js la porta 5000 e il resto del percorso e' 
        // quello inserito sempre nello stesso file che mi permette di accedere alle routes quindi 
        // andro a completare il mio link con register che 'e la route 
        // che mi permette di accedere al controller 
        const response = await axios.get(`http://localhost:5000/api/auth/check-auth`, {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate,',
                    
                }
            }
        );

        return response.data;
    }

)

export const logoutUser = createAsyncThunk("/auth/logout",
    async() => {
        //in quanto ho indicato nel mio server>server.js la porta 5000 e il resto del percorso e' 
        // quello inserito sempre nello stesso file che mi permette di accedere alle routes quindi 
        // andro a completare il mio link con register che 'e la route 
        // che mi permette di accedere al controller 
        const response = await axios.post(`http://localhost:5000/api/auth/logout`, {}, {
            withCredentials: true,
            
        });

        return response.data;
    }
)

export const refreshToken = createAsyncThunk("/auth/refresh",
    async() => {
        const response = await axios.post(`http://localhost:5000/api/auth/refresh`, {}, {
            withCredentials: true
        });

        return response.data;
    }
)

export const updateUsername = createAsyncThunk("/auth/update-username",
    async(username: string) => {
        const response = await axios.put(`http://localhost:5000/api/auth/update-username`, 
            { username }, 
            { withCredentials: true }
        );

        return response.data;
    }
)

export const updatePassword = createAsyncThunk("/auth/update-password",
    async(passwordData: { currentPassword: string; newPassword: string }) => {
        const response = await axios.put(`http://localhost:5000/api/auth/update-password`, 
            passwordData, 
            { withCredentials: true }
        );

        return response.data;
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{isAuthenticated: boolean, user: User}>) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.user = action.payload.user;
            state.isLoading = false;
        },
        resetAuth: (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.user = null;
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
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log(action);
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success ? true : false;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                console.log(action);
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(refreshToken.pending, (state) => {
                // Non impostiamo isLoading a true per il refresh perché dovrebbe essere trasparente
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                // Il token è stato aggiornato automaticamente nel cookie
                // Non abbiamo bisogno di aggiornare lo stato se è già autenticato
                if (action.payload.success) {
                    state.isAuthenticated = true;
                    if (action.payload.user) {
                        state.user = action.payload.user;
                    }
                }
            })
            .addCase(refreshToken.rejected, (state, action) => {
                // Se il refresh fallisce, l'utente deve fare login di nuovo
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(updateUsername.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUsername.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success && action.payload.user) {
                    state.user = action.payload.user;
                }
            })
            .addCase(updateUsername.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.isLoading = false;
            })
    }
})

export const { setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer