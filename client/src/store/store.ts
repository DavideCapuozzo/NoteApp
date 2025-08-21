import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index";
import notesReducer from "./note-slice/notesSlice"

const store = configureStore({
    reducer: {
        auth : authReducer,
        notes: notesReducer
    }

})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;