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
        const response = await axios.post('http://localhost:8080/register', userForm);
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
            let { result } = payload;
            state.success = result;
        }
    },

    extraReducers: {
        [postRegister.pending]: (state, action) => {
            console.log('pending');
        },
        [postRegister.fulfilled]: (state, { payload }) => {
            state.success = true;
        },
        [postRegister.rejected]: (state, action) => {
            console.log('rejected' + action.payload);
        }
    }
});

export let { setSuccess } = register.actions;
