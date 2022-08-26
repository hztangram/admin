import axios from 'axios';
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

export const postRegister = createAsyncThunk('POST_REGISTER', async (payload, { getState, rejectWithValue }) => {
    let { name, email, password } = payload;

    const userForm = {
        name: name,
        email: email,
        password: password
    };
    try {
        const response = await axios.post('https://team-play.kr/tangramAdmin/tangramAdmin/register', userForm);
        if (response.data.success) {
            alert('회원가입이 완료되었습니다.');
            return true;
        } else if (response.data.success === false) {
            if (response.data.code === 1) {
                alert('이메일이 중복되었습니다.');
            } else {
                alert('unknown error');
            }
            return false;
        }
    } catch (err) {
        alert(err);
        return rejectWithValue(err);
    }
});

export const register = createSlice({
    name: 'register',
    initialState: {
        success: false
    },
    reducers: {
        setSuccess(state, { payload }) {
            let result = payload.success;
            state.success = result;
        }
    },

    extraReducers: {
        [postRegister.fulfilled]: (state, { payload }) => {
            if (payload) state.success = true;
            else state.success = false;
        }
    }
});

export let { setSuccess } = register.actions;
