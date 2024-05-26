import { LOGGEDIN_USER } from "../constant/constant";
import { LOGOUT_USER } from "../constant/constant";
import axios from "axios";

export const loggedInUser=(userCreated)=>(dispatch)=>{
    dispatch({
        type:LOGGEDIN_USER,
        payload:userCreated
    })
}

export const logoutUser= ()=>async (dispatch)=>{
    document.location.href="/login";
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    await axios.get("/api/logout");
    dispatch({
        type:LOGOUT_USER,
    })
}
