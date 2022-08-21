import axios from 'axios';
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

export const checkLogin = createAsyncThunk('GET_SESSION', async (payload, { getState, rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:8080/logincheck');
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
