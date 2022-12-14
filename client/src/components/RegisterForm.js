import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

import { postRegister, setSuccess } from '../store/register';

// ===========================||  REGISTER ||=========================== //

const RegisterForm = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const success = useSelector((state) => state.register.success);
    const defaultPath = useSelector((state) => state.defaults.defaultPath);
    const navigate = useNavigate();
    useEffect(() => {
        if (success) {
            dispatch(setSuccess({ success: false }));
            navigate(defaultPath);
        }
    }, [success]);

    const [nameErr, setNameErr] = useState(false);
    const nameHandler = (e) => {
        const form = document.getElementById('registerForm');
        const name = form.querySelector('[name="name"]').value;
        name.length > 25 ? setNameErr(true) : setNameErr(false);
        name !== '' && name.length > 1 ? setNameErr(false) : setNameErr(true);
    };
    const [emailErr, setEmailErr] = useState(false);
    const emailHandler = (e) => {
        const form = document.getElementById('registerForm');
        const email = form.querySelector('[name="email"]').value;
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        reg.test(email) && email !== '' ? setEmailErr(false) : setEmailErr(true);
    };
    const [passwordErr, setPasswordErr] = useState(false);
    const passwordHandler = (e) => {
        let form = document.getElementById('registerForm');
        let password = form.querySelector('[name="password"]').value;
        password !== '' && password.length > 7 ? setPasswordErr(false) : setPasswordErr(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let form = document.getElementById('registerForm');
        let name = form.querySelector('[name="name"]').value;
        let email = form.querySelector('[name="email"]').value;
        let password = form.querySelector('[name="password"]').value;
        name === '' && setNameErr(true);
        email === '' && setEmailErr(true);
        password === '' && setPasswordErr(true);
        if (name !== '' && email !== '' && password !== '' && nameErr === false && emailErr === false && passwordErr === false) {
            dispatch(postRegister({ name, email, password }));
        }
    };

    return (
        <>
            <form noValidate id="registerForm">
                <TextField
                    fullWidth
                    label="Name"
                    margin="normal"
                    name="name"
                    type="text"
                    defaultValue=""
                    sx={{ ...theme.typography.customInput }}
                    onChange={nameHandler}
                    error={nameErr}
                    helperText={nameErr && '?????? ?????? 25????????? ??????'}
                />
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    name="email"
                    type="text"
                    defaultValue=""
                    sx={{ ...theme.typography.customInput }}
                    onChange={emailHandler}
                    error={emailErr}
                    helperText={emailErr && '???????????? ???????????? ??????????????????.'}
                />

                <TextField
                    fullWidth
                    label="Password"
                    margin="normal"
                    name="password"
                    type="password"
                    defaultValue=""
                    sx={{ ...theme.typography.customInput }}
                    onChange={passwordHandler}
                    error={passwordErr}
                    helperText={passwordErr && '??????????????? ???????????? ??????????????????.'}
                />

                <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            onClick={(e) => handleSubmit(e)}
                        >
                            Sign up
                        </Button>
                    </AnimateButton>
                </Box>
            </form>
        </>
    );
};

export default RegisterForm;
