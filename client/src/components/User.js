import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useDispatch, useSelector } from 'react-redux';
import {
    getUsers,
    toggleEdit,
    setData,
    updateUsers,
    cleanData,
    verifyEmail,
    setRefresh,
    setUpdate,
    deleteUsers,
    toggleAll
} from '../store/emailSubscribeUsers';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function BasicTable() {
    const dispatch = useDispatch();
    const refresh = useSelector((state) => state.emailSubscribeUsers.refresh);
    const users = useSelector((state) => state.emailSubscribeUsers.users);
    const pageSize = useSelector((state) => state.emailSubscribeUsers.pageSize);

    const saveMode = useSelector((state) => state.emailSubscribeUsers.saveMode) === 'Y' ? true : false;
    let isEditLeng;
    let editMode;
    useEffect(() => {
        dispatch(getUsers());
        refresh && dispatch(setRefresh());
    }, [refresh]);

    useEffect(() => {
        isEditLeng = users.reduce((prev, cur, idx) => {
            let _cur = cur;
            _cur.edit === true ? prev.set(cur.id, true) : prev.delete(cur.id);
            return prev;
        }, new Map()).size;
        // console.log(users.map((a) => a.edit));
        editMode = isEditLeng > 0 ? true : false;
    }, [users.map((a) => a.edit)]);

    const deleteHandler = () => {
        let deleteArr = [];
        users.map((a) => a.edit && deleteArr.push(Number(a.id)));
        dispatch(deleteUsers({ deleteArr }));
    };
    const updateHandler = () => {
        let rowArr = Array.from(document.querySelectorAll('[data-update="true"]'));
        let resultData = rowArr.map((data) => {
            let id = Number(data.getAttribute('data-key'));
            let email = data.querySelector('[name="email"]').value;
            let page = data.querySelector('[name="page"]').value;
            let lang = data.querySelector('[name="lang"]').value;
            let adAgree = Number(data.querySelector('[name="adAgree"]').value);
            let deleted = Number(data.querySelector('[name="deleted"]').value);
            return {
                id: id,
                email: email,
                page: page,
                lang: lang,
                adAgree: adAgree,
                deleted: deleted
            };
        });

        let invalidEamil = [];
        rowArr.map((row) => {
            let value = row.querySelector('[name="email"]').value;
            let id = row.getAttribute('data-key');
            var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            reg.test(value) === false && invalidEamil.push(id);
        });

        if (invalidEamil.length > 0) {
            dispatch(verifyEmail({ invalidEamil }));
        } else if (saveMode && invalidEamil.length <= 0) {
            dispatch(setData({ resultData }));
            dispatch(updateUsers())
                .then((res) => {
                    if (res.payload.status === 200 && res.payload.data.success) {
                        dispatch(cleanData());
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    //checkbox

    const _main = 'TANGRAM Main';
    const _smartrope = 'SmartRope LED';
    const _smartroperookie = 'SmartRope ROOKIE';
    const _smartropepure = 'SmartRope PURE';
    const _shop = 'TANGRAM SHOP';

    const _kr = 'KR';
    const _en = 'EN';
    const _jp = 'JP';
    const _cn = 'CN';
    const _de = 'DE';
    const _fr = 'FR';

    return (
        <>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                <FormControl sx={{ mr: 2, minWidth: 170 }} size="small" disabled={!editMode}>
                    <InputLabel>Page</InputLabel>
                    <Select label="Page" defaultValue="main">
                        <MenuItem value="main">TANGRAM Main</MenuItem>
                        <MenuItem value="smartrope">SmartRope LED</MenuItem>
                        <MenuItem value="smartroperookie">SmartRope ROOKIE</MenuItem>
                        <MenuItem value="smartropepure">SmartRope PURE</MenuItem>
                        <MenuItem value="shop">TANGRAM SHOP</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ mr: 2, minWidth: 170 }} size="small" disabled={!editMode}>
                    <InputLabel>Language</InputLabel>
                    <Select label="Language" defaultValue="main">
                        <MenuItem value="main">TANGRAM Main</MenuItem>
                        <MenuItem value="smartrope">SmartRope LED</MenuItem>
                        <MenuItem value="smartroperookie">SmartRope ROOKIE</MenuItem>
                        <MenuItem value="smartropepure">SmartRope PURE</MenuItem>
                        <MenuItem value="shop">TANGRAM SHOP</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="outlined" startIcon={<DeleteIcon />} sx={{ mr: 2 }} color="error" onClick={deleteHandler}>
                    Delete
                </Button>
                <Button variant="contained" endIcon={<SendIcon />} onClick={updateHandler} disabled={!saveMode}>
                    Save
                </Button>
            </Grid>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} stickyHeader className="fixed-table">
                    <colgroup>
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '56%' }} />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                {/* <Checkbox color="primary" checked={checkHandler} /> */}
                                <Checkbox color="primary" onClick={(e) => dispatch(toggleAll(e.target.checked))} />
                            </TableCell>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Page</TableCell>
                            <TableCell align="left">Language</TableCell>
                            <TableCell align="left">Ad Agree</TableCell>
                            <TableCell align="left">Created Date</TableCell>
                            <TableCell align="left">Modified Date</TableCell>
                            <TableCell align="left">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users &&
                            users.map((user) =>
                                user.edit ? (
                                    <TableRow
                                        key={user.id}
                                        data-key={user.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        name="row"
                                        data-edit={user.edit}
                                        data-update={user.isUpdate}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                label="checked"
                                                checked={user.edit}
                                                name="checkbox"
                                                onClick={() => dispatch(toggleEdit(user.id))}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {user.id}
                                        </TableCell>
                                        <TableCell align="left">
                                            <FormControl fullWidth>
                                                <TextField
                                                    error={user.verified ? false : true}
                                                    defaultValue={user.email}
                                                    helperText={!user.verified && '이메일을 올바른 형식으로 작성해주세요.'}
                                                    variant="standard"
                                                    name="email"
                                                    inputProps={{ 'data-key': user.id }}
                                                    onChange={(e) => dispatch(setUpdate())}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">
                                            <FormControl variant="standard" fullWidth>
                                                <Select defaultValue={user.page} name="page">
                                                    <MenuItem value="main">TANGRAM Main</MenuItem>
                                                    <MenuItem value="smartrope">SmartRope LED</MenuItem>
                                                    <MenuItem value="smartroperookie">SmartRope ROOKIE</MenuItem>
                                                    <MenuItem value="smartropepure">SmartRope PURE</MenuItem>
                                                    <MenuItem value="shop">TANGRAM SHOP</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">
                                            <FormControl variant="standard" fullWidth>
                                                <Select defaultValue={user.lang} name="lang">
                                                    <MenuItem value="kr">KR</MenuItem>
                                                    <MenuItem value="en">EN</MenuItem>
                                                    <MenuItem value="jp">JP</MenuItem>
                                                    <MenuItem value="cn">CN</MenuItem>
                                                    <MenuItem value="de">DE</MenuItem>
                                                    <MenuItem value="fr">FR</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">
                                            <FormControl variant="standard" fullWidth>
                                                <Select defaultValue={user.adAgree} name="adAgree">
                                                    <MenuItem value="1">Agree</MenuItem>
                                                    <MenuItem value="0">Disagree</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left" hidden>
                                            <FormControl variant="standard" fullWidth>
                                                <Select defaultValue={user.deleted} name="deleted">
                                                    <MenuItem value="1">undeleted</MenuItem>
                                                    <MenuItem value="0">deleted</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">{user.created}</TableCell>
                                        <TableCell align="left">{user.modified}</TableCell>
                                        <TableCell align="left" onClick={() => dispatch(toggleEdit(user.id))}>
                                            <CloseIcon className="secondary" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow
                                        key={user.id}
                                        data-key={user.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        data-edit={user.edit}
                                        data-update={user.isUpdate}
                                        name="row"
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={user.edit}
                                                name="checkbox"
                                                onClick={() => dispatch(toggleEdit(user.id))}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {user.id}
                                        </TableCell>
                                        <TableCell align="left">{user.email}</TableCell>
                                        <TableCell align="left">
                                            {(user.page === 'main' && _main) ||
                                                (user.page === 'smartrope' && _smartrope) ||
                                                (user.page === 'smartroperookie' && _smartroperookie) ||
                                                (user.page === 'smartropepure' && _smartropepure) ||
                                                (user.page === 'shop' && _shop)}
                                        </TableCell>
                                        <TableCell align="left">
                                            {(user.lang === 'kr' && _kr) ||
                                                (user.lang === 'en' && _en) ||
                                                (user.lang === 'jp' && _jp) ||
                                                (user.lang === 'cn' && _cn) ||
                                                (user.lang === 'de' && _de) ||
                                                (user.lang === 'fr' && _fr)}
                                        </TableCell>
                                        <TableCell align="left">
                                            {(user.adAgree === 1 && 'Agree') || (user.adAgree === 0 && 'Disagree')}
                                        </TableCell>
                                        <TableCell align="left" hidden>
                                            <FormControl variant="standard" fullWidth>
                                                <Select defaultValue={user.deleted} name="deleted">
                                                    <MenuItem value="1">undeleted</MenuItem>
                                                    <MenuItem value="0">deleted</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">{user.created}</TableCell>
                                        <TableCell align="left">{user.modified}</TableCell>
                                        <TableCell align="left" onClick={() => dispatch(toggleEdit(user.id))}>
                                            <EditIcon color="primary" />
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
                <Stack spacing={2}>
                    <Pagination
                        // count={count}
                        showFirstButton
                        showLastButton
                        // onClick={dispatch(getUsers({ pageSize: pageSize, page: ...}))}
                    />
                </Stack>
            </Grid> */}
        </>
    );
}
