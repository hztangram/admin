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
            verified: true,
            isUpdate: false
        };
    });
    return userData;
});

// export const getUsers = createAsyncThunk('GET_USERS', async (payload, { getState, rejectWithValue }) => {
//     const page = parseInt(payload.page) || 1;
//     const pageSize = parseInt(payload.pageSize) || 1;
//     pageData = {
//         page: page,
//         pageSize: pageSize
//     };
//     try {
//         const res = await axios.post(`http://localhost:8080/post/users/emailSubscribers`, pageData);
//         const users = res.data.users.map((user) => {
//            return {
//                id: user.id,
//                email: user.email,
//                page: user.path.split('/')[0],
//                lang: user.path.split('/')[1],
//                adAgree: Number(user.options[0]),
//                deleted: Number(user.options[1]),
//                created: user.created.slice(0, -5),
//                modified: user.modified.slice(0, -5),
//                edit: false,
//                verified: true
//            };
//         });
//         const totalPageLength = res.data.total;
//         const userData = {
//             users,
//             totalPageLength
//         };
//         return userData;
//     } catch (err) {
//         // Use `err.response.data` as `action.payload` for a `rejected` action,
//         // by explicitly returning it using the `rejectWithValue()` utility
//         return rejectWithValue(err.response.data);
//     }
// });

export const updateUsers = createAsyncThunk('UPDATE_USERS', async (_, { getState, rejectWithValue }) => {
    const _state = getState().emailSubscribeUsers;
    const _modefiedUsers = getState().emailSubscribeUsers.modefiedUsers;
    const newData = _modefiedUsers.map((user) => {
        return {
            id: user.id,
            email: user.email,
            path: [user.page, user.lang].join('/'),
            options: [user.adAgree, user.deleted].join('')
        };
    });

    if (confirm('고객 정보를 수정하시겠습니까?')) {
        try {
            const response = await axios.post('http://localhost:8080/update/users/emailSubscribers', newData);
            if (response.data.success) {
                alert('수정이 완료되었습니다.');
                return response;
            } else if (response.data.success === false) {
                alert('이메일이 중복되었습니다.');
                return false;
            } else {
                alert('알수없는오류');
                return false;
            }
        } catch (err) {
            alert(err);
            return rejectWithValue(err);
        }
    } else {
        alert('수정이 취소되었습니다.');
        return false;
    }
});

export const deleteUsers = createAsyncThunk('DELETE_USERS', async (payload, { getState, rejectWithValue }) => {
    const _users = getState().emailSubscribeUsers.users;
    const deleteArr = payload.deleteArr;
    const deleteData = [];
    deleteArr.map((del) => {
        _users.map((user) => {
            if (user.id === del) {
                deleteData.push({
                    id: user.id,
                    options: [user.adAgree, 0].join('')
                });
            }
        });
    });

    console.log(deleteData);
    if (confirm('고객 정보를 삭제하시겠습니까?')) {
        try {
            const response = await axios.post('http://localhost:8080/delete/users/emailSubscribers', deleteData);
            if (response.data.success) {
                alert('삭제가 완료되었습니다.');
                return response;
            } else {
                alert('삭제불가');
                return false;
            }
        } catch (err) {
            alert(err);
            return rejectWithValue(err);
        }
    } else {
        alert('삭제가 취소되었습니다.');
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
        refresh: false,
        pageSize: 50
        // total: total
    },
    reducers: {
        toggleEdit(state, { payload }) {
            let _users = state.users;
            let _id = payload;
            let idx = _users.findIndex((a) => {
                return a.id === _id;
            });
            let isEdit = _users[idx].edit; //value
            _users[idx].edit = !isEdit; //set

            if (isEdit === true) _users[idx].isUpdate = false; //x 버튼 누르면 isUpdate = false
            let isEditLeng = _users.filter((user) => {
                return user.edit === true;
            }).length;
            if (isEditLeng) {
            }
            // if()//toggleAll상태에서 한개라도 체크풀면 toggleAll check false
        },
        toggleAll(state, { payload }) {
            let _users = state.users;
            let isChecked = payload;
            _users.map((user) => {
                if (isChecked) {
                    user.edit = true;
                } else {
                    user.edit = false;
                }
            });
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

            let resultData = payload.resultData;

            const upsert = (array, element) => {
                const i = array.findIndex((_element) => _element.id === element.id);
                if (i > -1) array[i] = element;
                else array.push(element);
            };
            const setEmailUpdate = () => {
                _users.map((el, idx) => {
                    resultData.map((user) => {
                        upsert(_modefiedUsers, {
                            id: user.id,
                            email: user.email,
                            page: user.page,
                            lang: user.lang,
                            adAgree: user.adAgree,
                            deleted: user.deleted
                        });
                    });
                });
            };
            setEmailUpdate();
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
            // state.users = payload.users;
            // state.users = payload.total;
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

export let { toggleEdit, setData, cleanData, verifyEmail, setRefresh, resetRow, setUpdate, toggleAll } = emailSubscribeUsers.actions;
