import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index";
import notesReducer from "./note-slice/notesSlice";


const store = configureStore({
    reducer: {
        auth : authReducer,
        notes: notesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Thunk per resettare tutti i redux
export const resetAllRedux = () => (dispatch: AppDispatch) => {
    dispatch({ type: 'auth/resetAuth' });
    dispatch({ type: 'notes/resetNotes' });
};

export default store;