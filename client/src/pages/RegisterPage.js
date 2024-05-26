import { RegisterPageComponent } from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { loggedInUser } from '../redux/actions/userAction';

export const RegisterPage = () => {

    const dispatch=useDispatch();

    const registerUser = async (firstName,lastName,password,emailAddress) => {
        const { data } = await axios.post("/api/users/register",{firstName,lastName,password,emailAddress});
        if(data.msg==="new user got created"){
            
            localStorage.setItem("userInfo",JSON.stringify(data.newUser));
            sessionStorage.setItem("userInfo",JSON.stringify(data.newUser));
        }
        console.log(data);
        return data;
    }

    return (
        <><RegisterPageComponent registerUser={registerUser} dispatch={dispatch} loggedInUser={loggedInUser}/></>
    );
}