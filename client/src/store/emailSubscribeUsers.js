import axios from 'axios';
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

export const getUsers = createAsyncThunk('GET_USERS', async () => {
    const res = await axios.get('http://localhost:8080/get/users/emailSubscribers');
    const userData = res.data.users.map((user) => {
        return {
            id: user.id,
            email: user.email,
            page: user.path.split('/')[0],
            lang: user.path.split('/')[1],
            adAgree: user.options[0] === '1' ? 'Y' : 'N',
            deleted: user.options[1],
            created: user.created.slice(0, -5),
            modified: user.modified.slice(0, -5),
            edit: false,
            modefied: false,
            verified: true
        };
    });
    return userData;
});

export const updateUsers = createAsyncThunk('UPDATE_USERS', async (_, { getState, rejectWithValue }) => {
    const _state = getState().emailSubscribeUsers;
    const _modUsers = getState().emailSubscribeUsers.modefiedUsers;
    const newData = _modUsers.map((user) => {
        return {
            id: user.id,
            email: user.email
            //  path: [user.page, user.lang].join('/'),
            //  options: [user.adAgree === 'Y' ? 1 : 0, user.deleted].join('')
        };
    });

    if (confirm('고객 정보를 수정하시겠습니까?')) {
        try {
            const response = await axios.post('http://localhost:8080/update/users/emailSubscribers', newData);
            alert('수정이 완료되었습니다.');
            return response;
        } catch (err) {
            alert(err);
            return rejectWithValue('개발사에 문의하세요.');
        }
    } else {
        alert('수정이 취소되었습니다.');
        return false;
    }
});

export const emailSubscribeUsers = createSlice({
    name: 'users',
    initialState: {
        users: [],
        modefiedUsers: [],
        saveMode: 'N',
        idArray: [],
        refresh: false
    },
    reducers: {
        toggleEdit(state, { payload }) {
            let arr = [1, 10, 15];
            let _users = state.users;
            let _id = payload;
            let idx = _users.findIndex((a) => {
                return a.id === _id;
            });
            _users[idx].edit = !_users[idx].edit;
            var isEdit = _users.filter((a) => {
                return a.edit;
            });
            let _state = state;
            if (isEdit.length > 0) {
                _state.saveMode = 'Y';
            } else {
                _state.saveMode = 'N';
            }

            let _modUsers = state.modefiedUsers;
            const remove = (array, _id) => {
                const i = array.findIndex((_element) => _element.id === _id);
                if (i > -1) array.splice(i, 0);
            };
            remove(_modUsers, _id);
            console.log('rem' + _modUsers);
        },
        setData(state, { payload }) {
            let _users = state.users;
            let _modUsers = state.modefiedUsers;

            let emailData = payload.emailData;
            const upsert = (array, element) => {
                const i = array.findIndex((_element) => _element.id === element.id);
                if (i > -1) array[i] = element;
                else array.push(element);
            };
            const setEmailUpdate = () => {
                _users.map((el, idx) => {
                    emailData.forEach((value, key) => {
                        if (el.id === key) {
                            upsert(_modUsers, { id: key, email: value });
                        }
                    });
                });
            };
            setEmailUpdate();
            console.log('set' + _modUsers);
        },
        verifyEmail(state, { payload }) {
            alert('이메일을 올바른 형식으로 작성해주세요.');
            let _users = state.users;
            _users.map((el, idx) => {
                for (let i of payload.invalidEamil) {
                    if (el.id === i) {
                        el.verified = false;
                    } else {
                        el.verified = true;
                    }
                }
            });
        },
        cleanData(state, { payload }) {
            let _state = state;
            let _users = state.users;
            let _modUsers = state.modefiedUsers;
            const setInit = () => {
                _state.saveMode = 'N';
                _state.idArray = [];
                _state.refresh = true;
                _modUsers: [];
                _users.map((i) => {
                    i.edit = false;
                    i.verified = true;
                });
            };
            setInit();
            console.log('refresh t' + _state.refresh);
        },
        setRefresh(state, { payload }) {
            let _state = state;
            _state.refresh = false;
            console.log('refresh f' + _state.refresh);
        }
    },

    extraReducers: {
        [getUsers.pending]: (state, action) => {
            console.log('pending');
        },
        [getUsers.fulfilled]: (state, { payload }) => {
            state.users = payload;
        },
        [getUsers.rejected]: (state, action) => {
            console.log('rejected' + action.payload);
        },
        [updateUsers.pending]: (state, action) => {
            console.log('pending');
        },
        [updateUsers.fulfilled]: (state, { payload }) => {
            console.log('pending');
        },
        [updateUsers.rejected]: (state, action) => {
            console.log('rejected' + action.payload);
        }
    }
});

export let { toggleEdit, setData, cleanData, verifyEmail, setRefresh, resetRow } = emailSubscribeUsers.actions;
