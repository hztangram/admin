import { combineReducers } from '@reduxjs/toolkit';

// reducer import
import customizationReducer from './customizationReducer';
import { emailSubscribeUsers } from './emailSubscribeUsers';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    emailSubscribeUsers: emailSubscribeUsers.reducer
});

export default reducer;
