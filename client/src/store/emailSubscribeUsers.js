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
                    checked: false,
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
        users: [], //첫 로드시 불러오는 유저 데이터
        modefiedUsers: [], //개별수정시 수정 될 데이터
        batchMode: false, //일괄수정모드(체크박스 활성화 여부)
        saveMode: false, //SAVE 버튼 활성화 여부
        editMode: false, // 몰라
        modefiedIds: [], //일괄수정시 수정 될 데이터
        refresh: false, //SAVE후 화면 새로고침 (DB에서 유저정보 다시 불러옴)
        checkedAll: false, //전체선택
        //PAGING
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

            //엑스 누르면 인풋 초기화 -> 저장 X
            if (_edit === true) {
                _users[idx].isUpdate = false;
            }

            let leng = _users.filter((user) => user.isUpdate === true).length;
            leng <= 0 && (state.saveMode = false);
        },
        toggleCheck(state, { payload }) {
            let id = payload.id;
            let checked = payload.checked;
            let _users = state.users;
            let _modefiedIds = state.modefiedIds;
            let checkedAll = state.checkedAll;

            let idx = _users.findIndex((user) => {
                return user.id === id;
            });

            if (checked) {
                _modefiedIds.push(id);
                _users[idx].checked = true;
            } else {
                const i = _modefiedIds.findIndex((el) => el === id);
                if (i > -1) _modefiedIds.splice(i, 1);
                _users[idx].checked = false;
            }
            // let leng = _users.filter((user) => {
            //     user.checked = true;
            // });
            console.log(current(state.modefiedIds));
        },
        checkAll(state, { payload }) {
            let _users = state.users;
            let checkedAll = state.checkedAll;
            state.modefiedIds = [];
            let _modefiedIds = state.modefiedIds;
            if (!checkedAll) {
                _users.map((user) => {
                    _modefiedIds.push(user.id);
                    user.checked = true;
                });
            } else {
                _users.map((user) => {
                    _modefiedIds = [];
                    user.checked = false;
                });
            }
            state.checkedAll = !checkedAll; //toggle
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
                // _state.checkAll = false;
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
        [getUsers.fulfilled]: (state, { payload }) => {
            state.users = payload.users;
            state.total = payload.total;
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
    checkAll,
    selectUpdate,
    toggleCheck,
    setSaveMode,
    setBatch,
    checkedAll
} = emailSubscribeUsers.actions;
