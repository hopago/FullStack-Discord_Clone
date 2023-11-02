import { createSlice } from "@reduxjs/toolkit";
import { useState } from "react";

const initialState = {
    author: {
        authorId: '',
        userName: '',
        avatar: ''
    },
    embeds: {
        server_category: '',
        title: '',
        description: '',
        thumbnail: ''
    },
};

const serversSlice = createSlice({
    name: 'servers',
    initialState,
    reducers: {

    },
});



export default serversSlice.reducer;