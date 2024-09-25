export const createChatSlice = (set, get) => ({
    chatType: undefined,
    chatData: undefined,
    chatMessages: [],
    DMContacts: [],
    chatGroups: [],
    setChatType: (chatType)=> set({chatType}),
    setChatData: (chatData)=> set({chatData}),
    setChatMessages: (chatMessages)=> set({chatMessages}),
    setDMContacts: (DMContacts)=> set({DMContacts}),
    setChatGroups: (chatGroups)=> set({chatGroups}),
    closeChat: ()=> set({chatType: undefined, chatData: undefined, chatMessages: []}),
    addMessage: (message) => {
        const chatMessages = get().chatMessages;
        const chatType = get().chatType;

        set({
            chatMessages: [...chatMessages, {
                ...message,
                // receiver: chatType !== "group" ?
                //     message.receiver : message.receiver.id,
                // sender: chatType !== "group" ?
                //     message.sender : message.sender.id,
            }],

        });
    }
});