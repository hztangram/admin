import axios from 'axios';
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

export const postLogin = createAsyncThunk('POST_LOGIN', async (payload, { getState, rejectWithValue }) => {
    let { result } = payload;
    try {
        const response = await axios.post('http://localhost:8080/api/login', result, { withCredentials: true });
        if (response.data.success) {
            alert(response.data.message);
            return true;
        } else if (response.data.success === false) {
            if (response.data.code === 1) {
                alert(response.data.message);
            } else if (response.data.code === 2) {
                alert(response.data.message);
            } else {
                alert('알수없는오류');
            }
            return false;
        }
    } catch (err) {
        alert(err);
        return rejectWithValue(err);
    }
});

export const login = createSlice({
    name: 'login',
    initialState: {
        success: false
    },
    reducers: {},

    extraReducers: {
        [postLogin.pending]: (state, action) => {
            console.log('pending');
        },
        [postLogin.fulfilled]: (state, { payload }) => {
            state.success = true;
        },
        [postLogin.rejected]: (state, action) => {
            console.log('rejected' + action.payload);
        }
    }
});

export let {} = login.actions;
