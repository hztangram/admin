import { combineReducers } from '@reduxjs/toolkit';

// reducer import
import customizationReducer from './customizationReducer';
import { emailSubscribeUsers } from './emailSubscribeUsers';
import { register } from './register';
import { auth } from './auth';
import { login } from './login';
import { defaults } from './defaults';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    emailSubscribeUsers: emailSubscribeUsers.reducer,
    register: register.reducer,
    auth: auth.reducer,
    login: login.reducer,
    defaults: defaults.reducer
});

export default reducer;
