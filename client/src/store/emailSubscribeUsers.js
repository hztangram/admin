import axios from 'axios';
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

export const getUsers = createAsyncThunk('GET_USERS', async (payload, { getState, rejectWithValue }) => {
    const currentPage = payload.currentPage || getState().emailSubscribeUsers.currentPage;
    const pageSize = payload.pageSize || getState().emailSubscribeUsers.pageSize;
    const pages = { currentPage: currentPage, pageSize: pageSize };
    try {
        const res = await axios.post('http://localhost:8080/get/users/emailSubscribers', pages);
        if (res.data.success) {
            const users = res.data.users.map((user) => {
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
            const total = res.data.total;
            const data = { users: users, total: total };
            return data;
        }
    } catch (err) {
        alert(err);
        return rejectWithValue(err);
    }
});

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
        batchMode: false,
        saveMode: false,
        editMode: false,
        refresh: false,
        checkAll: false,
        currentPage: 0,
        pageSize: 20,
        total: null
    },
    reducers: {
        setBatch(state, { payload }) {
            let _batchMode = state.batchMode;
            state.batchMode = !_batchMode;
        },
        toggleEdit(state, { payload }) {
            // TOGGLE EDIT BUTTON
            let _id = payload;
            let _users = state.users;
            let idx = _users.findIndex((user) => {
                return user.id === _id;
            });
            let _edit = _users[idx].edit;
            _users[idx].edit = !_edit;

            if (_edit === true) {
                _users[idx].isUpdate = false;
            }

            let leng = _users.filter((user) => user.isUpdate === true).length;
            leng <= 0 && (state.saveMode = false);
        },
        toggleCheck(state, { payload }) {
            let _id = payload.id;
            let _checked = payload.checked;
            let _users = state.users;
            let _state = state;
            _users.map((user) => (user.edit = false));

            // let updateArr = [];
            // _users.map((el) => {
            //     return el.isUpdate && updateArr.push(el.id);
            // });
            // updateArr.length > 0 ? (_state.saveMode = true) : (_state.saveMode = false);
        },
        toggleAll(state, { payload }) {
            let _users = state.users;
            let isChecked = payload;
            _users.map((user) => {
                if (isChecked) {
                    user.edit = true;
                    state.checkAll = true;
                    state.editMode = true;
                } else {
                    user.edit = false;
                    state.checkAll = false;
                    state.editMode = false;
                    state.saveMode = false;
                }
            });
        },
        setSaveMode(state, { payload }) {
            // EDIT 모드에서 인풋 한가지라도 바뀌면 user마다 isUpdate = true
            let _id = payload;
            let _users = state.users;
            let _saveMode = state.saveMode;
            let idx = _users.findIndex((el) => {
                return el.id === _id;
            });
            _users[idx].isUpdate = true;

            // isUpdate가 1개 이상이면 saveMode = true
            let leng = _users.filter((user) => user.isUpdate === true).length;
            leng > 0 && (state.saveMode = true);
        },
        selectUpdate(state, { payload }) {
            // state.saveMode = true;
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
            const setDataUpdate = () => {
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
            setDataUpdate();
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
                _state.saveMode = false;
                _state.checkAll = false;
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
            state.users = payload.users;
            state.total = payload.total;
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

export let {
    toggleEdit,
    setData,
    cleanData,
    verifyEmail,
    setRefresh,
    resetRow,
    toggleAll,
    selectUpdate,
    toggleCheck,
    setSaveMode,
    setBatch
} = emailSubscribeUsers.actions;
