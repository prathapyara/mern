import { LOGGEDIN_USER, LOGOUT_USER } from "../constant/constant";

export const userRegisterLoginReducer=(state={},action)=>{
    switch(action.type){
        case LOGGEDIN_USER:
            return {
                ...state,
                userInfo:action.payload
            }
        case LOGOUT_USER:
            return {};  
        default:
            return state    
    }
}