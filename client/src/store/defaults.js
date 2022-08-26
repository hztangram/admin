import { createSlice } from '@reduxjs/toolkit';

export const defaults = createSlice({
    name: 'defaults',
    initialState: { defaultPath: '/index' }
});

export let {} = defaults.actions;
