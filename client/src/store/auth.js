import axios from 'axios';
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

// export const postauth = createAsyncThunk('POST_RIGISTER', async (payload, { getState, rejectWithValue }) => {
//     let { name, email, password } = payload;

//     const userForm = {
//         name: name,
//         email: email,
//         password: password
//     };
//     try {
//         const response = await axios.post('http://localhost:8080/auth', userForm);
//         if (response.data.success) {
//             alert('회원가입이 완료되었습니다.');
//             return true;
//         } else if (response.data.success === false) {
//             if (response.data.code === 1) {
//                 alert('이메일이 중복되었습니다.');
//             } else {
//                 alert('unknown error');
//             }
//             return false;
//         }
//     } catch (err) {
//         alert(err);
//         return rejectWithValue(err);
//     }
// });

export const auth = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {}
});

export let {} = auth.actions;
