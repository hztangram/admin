import React, { useState, useEffect } from 'react';
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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

import {
    getUsers,
    toggleEdit,
    updateUsers,
    cleanData,
    verifyEmail,
    setRefresh,
    deleteUsers,
    checkAll,
    selectUpdate,
    toggleCheck,
    setSaveMode,
    setBatch
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
    const saveMode = useSelector((state) => state.emailSubscribeUsers.saveMode);
    const currentPage = useSelector((state) => state.emailSubscribeUsers.currentPage);
    const pageSize = useSelector((state) => state.emailSubscribeUsers.pageSize);
    const total = useSelector((state) => state.emailSubscribeUsers.total);
    const count = Math.floor(total / pageSize) + 1;
    const batchMode = useSelector((state) => state.emailSubscribeUsers.batchMode);
    const checkedAll = useSelector((state) => state.emailSubscribeUsers.checkedAll);

    useEffect(() => {
        const page = document.querySelector('[aria-current="true"]').innerText;
        dispatch(getUsers({ currentPage: pageSize * (page - 1) }));
        refresh && dispatch(setRefresh());
    }, [refresh]);

    useEffect(() => {
        dispatch(cleanData());
    }, [batchMode]);

    const deleteHandler = () => {
        let deleteArr = [];
        users.map((a) => a.checked && deleteArr.push(Number(a.id)));
        dispatch(deleteUsers({ deleteArr })).then((res) => {
            if (res.payload.status === 200 && res.payload.data.success) {
                dispatch(cleanData());
            }
        });
    };
    const updateHandler = () => {
        //개별수정모드
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
            dispatch(updateUsers({ resultData }))
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
    const updateBatchHandler = () => {
        let rowArr = Array.from(document.querySelectorAll('[data-update="true"]'));

        let resultData = rowArr.map((data) => {
            let id = Number(data.getAttribute('data-key'));
            let email = data.querySelector('[name="email"]').value;
            let page = document.querySelector('[name="batchPage"]').value;
            let lang = document.querySelector('[name="batchLang"]').value;
            let adAgree = Number(document.querySelector('[name="batchAdAgree"]').value);
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
        dispatch(updateUsers({ resultData }))
            .then((res) => {
                if (res.payload.status === 200 && res.payload.data.success) {
                    dispatch(cleanData());
                }
            })
            .catch((error) => {
                console.error(error);
            });
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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',

                    height: '42px'
                }}
            >
                <Box>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch onChange={() => dispatch(setBatch())} />}
                            label={batchMode ? '일괄수정모드 끄기' : '일괄수정모드 켜기'}
                        />
                    </FormGroup>
                </Box>
                <Box>
                    {batchMode && (
                        <>
                            <FormControl sx={{ mr: 2, minWidth: 170 }} size="small" disabled={!saveMode}>
                                <InputLabel>Page</InputLabel>
                                <Select label="Page" defaultValue="main" name="batchPage">
                                    <MenuItem value="main">TANGRAM Main</MenuItem>
                                    <MenuItem value="smartrope">SmartRope LED</MenuItem>
                                    <MenuItem value="smartroperookie">SmartRope ROOKIE</MenuItem>
                                    <MenuItem value="smartropepure">SmartRope PURE</MenuItem>
                                    <MenuItem value="shop">TANGRAM SHOP</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ mr: 2, minWidth: 170 }} size="small" disabled={!saveMode}>
                                <InputLabel>Language</InputLabel>
                                <Select label="Language" defaultValue="kr" name="batchLang">
                                    <MenuItem value="kr">KR</MenuItem>
                                    <MenuItem value="en">EN</MenuItem>
                                    <MenuItem value="jp">JP</MenuItem>
                                    <MenuItem value="cn">CN</MenuItem>
                                    <MenuItem value="de">DE</MenuItem>
                                    <MenuItem value="fr">FR</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ mr: 2, minWidth: 170 }} size="small" disabled={!saveMode}>
                                <InputLabel>Ad Agree </InputLabel>
                                <Select label="Ad Agree" defaultValue="1" name="batchAdAgree">
                                    <MenuItem value="1">Agree</MenuItem>
                                    <MenuItem value="0">Disagree</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                sx={{ mr: 2 }}
                                color="error"
                                disabled={!saveMode}
                                onClick={deleteHandler}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        disabled={!saveMode}
                        onClick={batchMode ? updateBatchHandler : updateHandler}
                    >
                        Save
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} stickyHeader className="fixed-table">
                    <colgroup>
                        {batchMode ? (
                            <>
                                <col style={{ width: '1%' }} />
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '16%' }} />
                            </>
                        ) : (
                            <>
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '16%' }} />
                                <col style={{ width: '1%' }} />
                            </>
                        )}
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            {batchMode && (
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary" onClick={() => dispatch(checkAll())} checked={checkedAll} />
                                </TableCell>
                            )}
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Page</TableCell>
                            <TableCell align="left">Language</TableCell>
                            <TableCell align="left">Ad Agree</TableCell>
                            <TableCell align="left">Created Date</TableCell>
                            <TableCell align="left">Modified Date</TableCell>
                            {!batchMode && <TableCell align="center">Edit</TableCell>}
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
                                        <TableCell component="th" scope="row">
                                            {user.id}
                                        </TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                fullWidth
                                                error={user.verified ? false : true}
                                                defaultValue={user.email}
                                                helperText={!user.verified && '이메일을 올바른 형식으로 작성해주세요.'}
                                                variant="standard"
                                                name="email"
                                                onChange={() => dispatch(setSaveMode(user.id))}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Select
                                                fullWidth
                                                variant="standard"
                                                defaultValue={user.page}
                                                name="page"
                                                onChange={() => dispatch(setSaveMode(user.id))}
                                            >
                                                <MenuItem value="main">TANGRAM Main</MenuItem>
                                                <MenuItem value="smartrope">SmartRope LED</MenuItem>
                                                <MenuItem value="smartroperookie">SmartRope ROOKIE</MenuItem>
                                                <MenuItem value="smartropepure">SmartRope PURE</MenuItem>
                                                <MenuItem value="shop">TANGRAM SHOP</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Select
                                                variant="standard"
                                                fullWidth
                                                defaultValue={user.lang}
                                                name="lang"
                                                onChange={() => dispatch(setSaveMode(user.id))}
                                            >
                                                <MenuItem value="kr">KR</MenuItem>
                                                <MenuItem value="en">EN</MenuItem>
                                                <MenuItem value="jp">JP</MenuItem>
                                                <MenuItem value="cn">CN</MenuItem>
                                                <MenuItem value="de">DE</MenuItem>
                                                <MenuItem value="fr">FR</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Select
                                                variant="standard"
                                                fullWidth
                                                defaultValue={user.adAgree}
                                                name="adAgree"
                                                onChange={() => dispatch(setSaveMode(user.id))}
                                            >
                                                <MenuItem value="1">Agree</MenuItem>
                                                <MenuItem value="0">Disagree</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell align="left" className="hidden">
                                            <Select
                                                variant="standard"
                                                fullWidth
                                                defaultValue={user.deleted}
                                                name="deleted"
                                                onChange={() => dispatch(setSaveMode(user.id))}
                                            >
                                                <MenuItem value="1">undeleted</MenuItem>
                                                <MenuItem value="0">deleted</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell align="left">{user.created}</TableCell>
                                        <TableCell align="left">{user.modified}</TableCell>
                                        <TableCell align="center">
                                            <Button onClick={() => dispatch(toggleEdit(user.id))}>
                                                <CloseIcon className="secondary" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow
                                        key={user.id}
                                        data-key={user.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        name="row"
                                        data-edit={user.edit}
                                        data-update={user.isUpdate}
                                    >
                                        {batchMode && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    name="checkbox"
                                                    onChange={(e) => dispatch(toggleCheck({ id: user.id, checked: e.target.checked }))}
                                                    checked={user.checked}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell component="th" scope="row">
                                            {user.id}
                                        </TableCell>
                                        <TableCell align="left">
                                            <input value={user.email} name="email" className="customInput" disabled />
                                        </TableCell>
                                        <TableCell align="left">
                                            <input
                                                value={
                                                    (user.page === 'main' && _main) ||
                                                    (user.page === 'smartrope' && _smartrope) ||
                                                    (user.page === 'smartroperookie' && _smartroperookie) ||
                                                    (user.page === 'smartropepure' && _smartropepure) ||
                                                    (user.page === 'shop' && _shop)
                                                }
                                                name="page"
                                                className="customInput"
                                                disabled
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <input
                                                value={
                                                    (user.lang === 'kr' && _kr) ||
                                                    (user.lang === 'en' && _en) ||
                                                    (user.lang === 'jp' && _jp) ||
                                                    (user.lang === 'cn' && _cn) ||
                                                    (user.lang === 'de' && _de) ||
                                                    (user.lang === 'fr' && _fr)
                                                }
                                                name="lang"
                                                className="customInput"
                                                disabled
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <select value={user.adAgree} name="adAgree" className="customSelect" disabled>
                                                <option value="1">Agree</option>
                                                <option value="0">Disagree</option>
                                            </select>
                                        </TableCell>
                                        <TableCell align="left" className="hidden">
                                            <input value={user.deleted} name="deleted" className="customInput" disabled />
                                        </TableCell>
                                        <TableCell align="left">{user.created}</TableCell>
                                        <TableCell align="left">{user.modified}</TableCell>
                                        {!batchMode && (
                                            <TableCell align="center">
                                                <Button onClick={() => dispatch(toggleEdit(user.id))}>
                                                    <EditIcon color="primary" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
                <Stack spacing={2}>
                    <Pagination
                        count={count}
                        showFirstButton
                        showLastButton
                        onChange={(_, page) => dispatch(getUsers({ currentPage: pageSize * (page - 1) }))}
                    />
                </Stack>
            </Grid>
        </>
    );
}
