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
import { getUsers, toggleEdit, setData, updateUsers, cleanData, verifyEmail, setRefresh } from '../store/emailSubscribeUsers';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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
        let rowArr = Array.from(document.getElementsByName('row'));
        let emailArr = Array.from(document.getElementsByName('email'));

        let emailData = new Map();
        let invalidEamil = [];

        emailArr.map((i) => {
            let id = Number(i.getAttribute('data-key'));
            let value = i.value;
            var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            rowArr.map((j) => {
                Number(j.getAttribute('data-key')) === id && emailData.set(id, value);
            });
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
    const [isChecked, setIschecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const checkHandler = ({ target }) => {
        //check toggle
        setIschecked(!isChecked);
        checkedItemHandler(target.parentElement.parentElement.id, target.checked);
    };
    const checkedItemHandler = (id, isChecked) => {
        if (isChecked) {
            checkedItems.add(id);
            setCheckedItems(checkedItems);
        } else {
            checkedItems.delete(id);
            setCheckedItems(checkedItems);
        }
    };

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
        <TableContainer component={Paper}>
            <Grid container justifyContent="flex-end">
                <Button variant="outlined" startIcon={<DeleteIcon />} sx={{ mr: 2 }} color="error">
                    Delete
                </Button>
                <Button variant="contained" endIcon={<SendIcon />} onClick={updateHandler} disabled={!saveMode}>
                    Save
                </Button>
            </Grid>

            <Table sx={{ minWidth: 650 }} stickyHeader className="fixed-table">
                <colgroup>
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '5%' }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            {/* <Checkbox color="primary" checked={checkHandler} /> */}
                            <Checkbox color="primary" onChange={checkHandler} />
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
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox color="primary" onChange={checkHandler} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {user.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        <FormControl fullWidth>
                                            <TextField
                                                id="standard-error-helper-text"
                                                error={user.verified ? false : true}
                                                defaultValue={user.email}
                                                helperText={!user.verified && '이메일을 올바른 형식으로 작성해주세요.'}
                                                variant="standard"
                                                name="email"
                                                inputProps={{ 'data-key': user.id }}
                                            />
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="left">
                                        <FormControl fullWidth>
                                            <NativeSelect value={user.page}>
                                                <option value="main">TANGRAM Main</option>
                                                <option value="smartrope">SmartRope LED</option>
                                                <option value="smartroperookie">SmartRope ROOKIE</option>
                                                <option value="smartropepure">SmartRope PURE</option>
                                                <option value="shop">TANGRAM SHOP</option>
                                            </NativeSelect>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="left">
                                        <FormControl variant="standard" fullWidth>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                defaultValue={user.lang}
                                            >
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
                                        <NativeSelect defaultValue={30}>
                                            <option value="main">Agree</option>
                                            <option value="smartrope">Disagree</option>
                                        </NativeSelect>
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
                                    name="row"
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox color="primary" onChange={checkHandler} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {user.id}
                                    </TableCell>
                                    <TableCell align="left">{user.email}</TableCell>
                                    <TableCell align="left">{user.page}</TableCell>
                                    <TableCell align="left">
                                        {(user.lang === 'kr' && _kr) ||
                                            (user.lang === 'en' && _en) ||
                                            (user.lang === 'jp' && _jp) ||
                                            (user.lang === 'cn' && _cn) ||
                                            (user.lang === 'de' && _de) ||
                                            (user.lang === 'fr' && _fr)}
                                    </TableCell>
                                    <TableCell align="left">{user.adAgree}</TableCell>
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
    );
}
