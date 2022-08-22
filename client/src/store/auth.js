import axios from 'axios';
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

export const checkLogin = createAsyncThunk('CHECK_LOGIN', async (payload, { getState, rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:8080/api/checklogin', {}, { withCredentials: true });
        console.log(response);
    } catch (err) {
        alert(err);
        return rejectWithValue(err);
    }
});

export const auth = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {}
});

export let {} = auth.actions;
