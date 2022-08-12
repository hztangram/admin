import { createStore } from 'redux';
import reducer from './reducer';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

// ==============================|| REDUX - MAIN STORE ||============================== //

// const store = createStore(reducer);
const persister = 'Free';

const store = configureStore({
    reducer: reducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
});

export { store, persister };
