import { combineReducers } from '@reduxjs/toolkit';

// reducer import
import customizationReducer from './customizationReducer';
import { emailSubscribeUsers } from './emailSubscribeUsers';
import { register } from './register';
import { auth } from './auth';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    emailSubscribeUsers: emailSubscribeUsers.reducer,
    register: register.reducer,
    auth: auth.reducer
});

export default reducer;
