import { createSlice } from "@reduxjs/toolkit";

const conversationsSlice = createSlice({
    name: 'conversation',
    initialState: {
        nonDisplayConversationIds: [],
    },
    reducers: {
        setNonDisplay: (state, action) => {
            const id = action.payload;
            if (!state.nonDisplayConversationIds.length) {
                state.nonDisplayConversationIds.push(id);
            } else {
                state.nonDisplayConversationIds = [...state.nonDisplayConversationIds, id]
            }
        },
        removeNonDisplay: (state, action) => {
            const displayedConversationId = action.payload;
            state.nonDisplayConversationIds = state.nonDisplayConversationIds.filter(id => id !== displayedConversationId);
        }
    }
});

export const { setNonDisplay, removeNonDisplay } = conversationsSlice.reducer;

export default conversationsSlice.reducer;

export const selectNonDisplayConversations = (state) => state.conversation.nonDisplayConversationIds;