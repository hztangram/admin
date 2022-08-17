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
            adAgree: Number(user.options[0]),
            deleted: Number(user.options[1]),
            created: user.created.slice(0, -5),
            modified: user.modified.slice(0, -5),
            edit: false,
            isUpdate: false,
            verified: true
        };
    });
    return userData;
});

export const updateUsers = createAsyncThunk('UPDATE_USERS', async (_, { getState, rejectWithValue }) => {
    const _state = getState().emailSubscribeUsers;
    const _modefiedUsers = getState().emailSubscribeUsers.modefiedUsers;
    const newData = _modefiedUsers.map((user) => {
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
            if (response.data.success) {
                alert('수정이 완료되었습니다.');
                return response;
            } else if ((response.data.success = false)) {
                alert('이메일이 중복되었습니다.');
                return false;
            } else {
                alert('알수없는오류');
                return false;
            }
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
        checkArray: [],
        refresh: false
    },
    reducers: {
        toggleEdit(state, { payload }) {
            let _users = state.users;
            let _id = payload;
            let idx = _users.findIndex((a) => {
                return a.id === _id;
            });
            let idEdit = _users[idx].edit; //value
            _users[idx].edit = !idEdit; //set

            if (idEdit === true) _users[idx].isUpdate = false; //x 버튼 누르면 isUpdate = false
        },
        setUpdate(state, { payload }) {
            let _users = state.users;
            let _id = payload;
            let _state = state;

            let idx = _users.findIndex((el) => {
                return el.id === _id;
            });
            _users[idx].isUpdate = true;

            let updateArr = [];
            _users.map((el) => {
                return el.isUpdate && updateArr.push(el.id);
            });
            updateArr.length > 0 ? (_state.saveMode = 'Y') : (_state.saveMode = 'N');
        },
        setData(state, { payload }) {
            let _users = state.users;
            let _modefiedUsers = state.modefiedUsers;

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
                            upsert(_modefiedUsers, { id: key, email: value });
                        }
                    });
                });
            };
            setEmailUpdate();
            console.log(emailData);
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
            let _modefiedId = state.modefiedId;
            const setInit = () => {
                _state.saveMode = 'N';
                _state.refresh = true;
                _modefiedId: [];
                _users.map((i) => {
                    i.edit = false;
                    i.verified = true;
                });
            };
            setInit();
        },
        setRefresh(state, { payload }) {
            let _state = state;
            _state.refresh = false;
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

export let { toggleEdit, setData, cleanData, verifyEmail, setRefresh, resetRow, setUpdate } = emailSubscribeUsers.actions;
