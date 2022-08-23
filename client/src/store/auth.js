import axios from 'axios';
axios.defaults.withCredentials = true;
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

export const checkLogin = createAsyncThunk('CHECK_LOGIN', async (payload, { getState, rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:8080/api/tgAdmin/checklogin');
        const result = response.data;
        console.log(result);
        return result;
    } catch (err) {
        alert(err);
        return rejectWithValue(err);
    }
});

export const auth = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        userName: null
    },
    reducers: {},
    extraReducers: {
        [checkLogin.pending]: (state, action) => {
            console.log('pending');
        },
        [checkLogin.fulfilled]: (state, { payload }) => {
            payload.isLoggedIn ? (state.isLoggedIn = true) : (state.isLoggedIn = false);
            state.userName = payload.userName;
        },
        [checkLogin.rejected]: (state, action) => {
            console.log('rejected' + action.payload);
        }
    }
});

export let {} = auth.actions;
