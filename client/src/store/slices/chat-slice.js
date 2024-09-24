export const createChatSlice = (set, get) => ({
    chatType: undefined,
    chatData: undefined,
    chatMessages: [],
    DMContacts: [],
    setChatType: (chatType)=> set({chatType}),
    setChatData: (chatData)=> set({chatData}),
    setChatMessages: (chatMessages)=> set({chatMessages}),
    setDMContacts: (DMContacts)=> set({DMContacts}),
    closeChat: ()=> set({chatType: undefined, chatData: undefined, chatMessages: []}),
    addMessage: (message) => {
        const chatMessages = get().chatMessages;
        const chatType = get().chatType;

        set({
            chatMessages: [...chatMessages, {
                ...message,
                receiver: chatType !== "channel" ?
                    message.receiver : message.receiver.id,
                sender: chatType !== "channel" ?
                    message.sender : message.sender.id,
            }],

        });
    }
});