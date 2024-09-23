export const createChatSlice = (set) => ({
    chatType: undefined,
    chatData: undefined,
    chatMessages: [],
    setChatType: (chatType)=> set({chatType}),
    setChatData: (chatData)=> set({chatData}),
    setChatMessages: (chatMessages)=> set({chatMessages}),
    closeChat: ()=> set({chatType: undefined, chatData: undefined, chatMessages: []}),
});