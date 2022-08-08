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
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';

export default function BasicTable() {
    //user list 초기화
    const [users, setUsers] = useState(null);
    const getUsers = async () => {
        const posts = await axios.get('http://localhost:8080/userList');
        var _users = posts.data.users;
        setUsers({
            id: _users.id,
            email: _users.email,
            path: _users.path,
            option: _users.option,
            created: _users.created,
            modified: _users.modified,
            isEdit: false
        });
    };
    useEffect(() => {
        //첫 랜더링시 user list data 가져오기
        getUsers();
    }, []);

    //checkbox
    const [isChecked, setIschecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const checkHandler = ({ target }) => {
        //check toggle
        setIschecked(!isChecked);
        checkedItemHandler(target.value, target.checked);
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
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    //user edit
    const updateUser = (id) => {
        const newState = users.map((user) => {
            if (user.id === id) {
                return { ...user, email: 'done@honmail.com' };
            }
            // 👇️ otherwise return object as is
            return user;
        });
        setUsers(newState);
    };
    // useEffect(() => {
    //     console.log(users);
    // }, [users]);
    const [isEdit, setEditItems] = useState(new Set());
    const toggleEdit = (id, isEdit) => {
        setEditItems(!isEdit);
        toggleEditHandler(target.id, isEdit);
        console.log(isEdit);
    };
    const toggleEditHandler = (id, isEdit) => {
        if (isEdit) {
            setEditItems.add(id);
            setCheckedItems(isEdit);
        } else {
            setEditItems.delete(id);
            setCheckedItems(isEdit);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            {/* <Checkbox color="primary" checked={checkHandler} /> */}
                            <Checkbox {...label} color="primary" onChange={checkHandler} />
                        </TableCell>
                        <TableCell align="left">ID</TableCell>
                        <TableCell align="left">Email</TableCell>
                        <TableCell align="left">Path</TableCell>
                        <TableCell align="left">Options</TableCell>
                        <TableCell align="left">Created Date</TableCell>
                        <TableCell align="left">Modified Date</TableCell>
                        <TableCell align="left">Edit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users &&
                        users.map((user) =>
                            user.isEdit ? (
                                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox {...label} value={user.id} color="primary" onChange={checkHandler} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {user.id}
                                    </TableCell>
                                    <TableCell align="left">{user.email}</TableCell>
                                    <TableCell align="left">{user.path}</TableCell>
                                    <TableCell align="left">{user.options}</TableCell>
                                    <TableCell align="left">{user.created}</TableCell>
                                    <TableCell align="left">{user.modified}</TableCell>
                                    <TableCell align="left" onClick={() => toggleEdit(user.id)}>
                                        <EditIcon />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox {...label} value={user.id} color="primary" onChange={checkHandler} />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {user.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField value={user.email} onChange={() => singleUpdateUser(user.id)} />
                                    </TableCell>
                                    <TableCell align="left">{user.path}</TableCell>
                                    <TableCell align="left">{user.options}</TableCell>
                                    <TableCell align="left">{user.created}</TableCell>
                                    <TableCell align="left">{user.modified}</TableCell>
                                    <TableCell align="left" onClick={() => singleSaveUser(user.id)}>
                                        <SaveIcon />
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
