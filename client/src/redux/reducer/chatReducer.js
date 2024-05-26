import { CHAT_BETWEEN_CLIENT_ADMIN, ADMIN_REPLAY,MESSAGE_RECEIVED,REMOVE_CHATROOMS } from "../constant/constant";

export const chatReduer = (state = { chatRooms: {} }, action) => {

    switch (action.type) {
        case CHAT_BETWEEN_CLIENT_ADMIN:
            const { user, message } = action.payload;
            let currentState = { ...state };
            if (state.chatRooms[user]) {
                currentState.chatRooms[user].push({ client: message });
                return {
                    ...state,
                    chatRooms: { ...currentState.chatRooms }
                }
            } else {

                return {
                    ...state,
                    chatRooms: { ...currentState.chatRooms, [user]: [{ client: message }] }
                }
            }

        case ADMIN_REPLAY:
            const { clientName, adminMessage } = action.payload
            let currentStateAdmin = { ...state };
            if (state.chatRooms[clientName]) {
                currentStateAdmin.chatRooms[clientName].push({ admin: adminMessage });
                return {
                    ...state,
                    chatRooms: { ...currentStateAdmin.chatRooms }
                }
            } else {
                return {
                    ...state,
                    chatRooms: { ...currentState.chatRooms, [clientName]: [{ admin: adminMessage }] }
                }
            }

        case MESSAGE_RECEIVED:
            const {value}=action.payload;
            return {
                ...state,
                messageReceivedFromClient:value
            }    
        case REMOVE_CHATROOMS:
           
            let currentChatRoomsState={...state}
            delete currentChatRoomsState.chatRooms[action.payload];
            return {
                ...state,
                chatRooms:{...currentChatRoomsState.chatRooms}
            }

        default:
            return state
    }
}
