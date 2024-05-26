import { CHAT_BETWEEN_CLIENT_ADMIN,ADMIN_REPLAY,MESSAGE_RECEIVED,REMOVE_CHATROOMS } from "../constant/constant";


export const chatActions=(user,message)=>(dispatch)=>{
    
    dispatch({
        type:CHAT_BETWEEN_CLIENT_ADMIN,
        payload:{
            user:user,
            message:message
        }
    })
};

export const AdminReply=(user,message)=>dispatch=>{

    dispatch({
        type:ADMIN_REPLAY,
        payload:{
            clientName:user,
            adminMessage:message
        }
    })
}

export const messageReceived=(value)=>(dispatch)=>{
    dispatch({
        type:MESSAGE_RECEIVED,
        payload:{
            value:value
        }
    })
}

export const RemoveChatRooms=(socketId)=>(dispatch)=>{
    dispatch({
        type:REMOVE_CHATROOMS,
        payload:socketId
    })
}