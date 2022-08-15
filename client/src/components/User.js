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
import { getUsers, toggleEdit, setData, updateUsers, cleanData, verifyEmail, setRefresh, setUpdate } from '../store/emailSubscribeUsers';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import FormHelperText from '@mui/material/FormHelperText';

export default function BasicTable() {
    const dispatch = useDispatch();
    const refresh = useSelector((state) => state.emailSubscribeUsers.refresh);
    const users = useSelector((state) => state.emailSubscribeUsers.users);
    const saveMode = useSelector((state) => state.emailSubscribeUsers.saveMode) === 'Y' ? true : false;

    useEffect(() => {
        dispatch(getUsers());
        refresh && dispatch(setRefresh());
    }, [refresh]);

    const updateHandler = () => {
        let rowArr = Array.from(document.querySelectorAll('[data-update="true"]'));
        let emailArr = [];
        rowArr.forEach((el) => {
            emailArr.push(el.querySelector('[name="email"]'));
        });

        let emailData = new Map();
        let invalidEamil = [];

        emailArr.map((i) => {
            let id = Number(i.closest('tr').getAttribute('data-key')); //tr의 data-key
            let value = i.value;
            var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            emailData.set(id, value);
            reg.test(value) === false && invalidEamil.push(id);
        });

        if (invalidEamil.length > 0) {
            dispatch(verifyEmail({ invalidEamil }));
        } else if (saveMode && invalidEamil.length <= 0) {
            dispatch(setData({ emailData }));
            dispatch(updateUsers())
                .then((res) => {
                    if (res.payload.status === 200) {
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
                <FormControl sx={{ mr: 2, minWidth: 170 }} size="small" disabled={!saveMode}>
                    <InputLabel>Page</InputLabel>
                    <Select label="Page">
                        <MenuItem value="main">TANGRAM Main</MenuItem>
                        <MenuItem value="smartrope">SmartRope LED</MenuItem>
                        <MenuItem value="smartroperookie">SmartRope ROOKIE</MenuItem>
                        <MenuItem value="smartropepure">SmartRope PURE</MenuItem>
                        <MenuItem value="shop">TANGRAM SHOP</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ mr: 2, minWidth: 170 }} size="small" disabled={!saveMode}>
                    <InputLabel>Language</InputLabel>
                    <Select label="Language">
                        <MenuItem value="main">TANGRAM Main</MenuItem>
                        <MenuItem value="smartrope">SmartRope LED</MenuItem>
                        <MenuItem value="smartroperookie">SmartRope ROOKIE</MenuItem>
                        <MenuItem value="smartropepure">SmartRope PURE</MenuItem>
                        <MenuItem value="shop">TANGRAM SHOP</MenuItem>
                    </Select>
                    {saveMode}
                </FormControl>

                <Button variant="outlined" startIcon={<DeleteIcon />} sx={{ mr: 2 }} color="error">
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
                                <Checkbox color="primary" />
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
                                            <Checkbox color="primary" onClick={() => dispatch(toggleEdit(user.id))} />
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
                                                    onChange={() => dispatch(setUpdate(user.id))}
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="left">
                                            <FormControl variant="standard" fullWidth>
                                                <Select defaultValue={user.page}>
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
                                                <Select defaultValue={user.lang}>
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
                                                <Select defaultValue={user.adAgree}>
                                                    <MenuItem value="1">Agree</MenuItem>
                                                    <MenuItem value="0">Disagree</MenuItem>
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
                                            <Checkbox color="primary" onClick={() => dispatch(toggleEdit(user.id))} />
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
        </>
    );
}
