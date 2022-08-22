import axios from 'axios';
axios.defaults.withCredentials = true;
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

export const checkLogin = createAsyncThunk('CHECK_LOGIN', async (payload, { getState, rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:8080/api/checklogin');
        const result = response.data.isLoggedIn;
        return result;
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
    reducers: {},
    extraReducers: {
        [checkLogin.pending]: (state, action) => {
            console.log('pending');
        },
        [checkLogin.fulfilled]: (state, { payload }) => {
            payload ? (state.isLoggedIn = true) : (state.isLoggedIn = true);
        },
        [checkLogin.rejected]: (state, action) => {
            console.log('rejected' + action.payload);
        }
    }
});

export let {} = auth.actions;
