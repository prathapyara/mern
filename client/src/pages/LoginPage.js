import axios from 'axios';
import { LoginPageComponent } from './components/LoginPageComponent';
import { useDispatch } from 'react-redux';
import { loggedInUser } from '../redux/actions/userAction';

export const LoginPage = () => {
    
    const dispatch=useDispatch();

    const loginUser = async (email, password, doNotLogOut) => {
        const { data } = await axios.post("/api/users/login", { emailAddress: email, password, doNotLogOut });
        
        if(data.loggedUser.doNotLogOut) {
            localStorage.setItem("userInfo",JSON.stringify(data.loggedUser));
        }else{
            sessionStorage.setItem("userInfo",JSON.stringify(data.loggedUser));
        }
        return data;
    }

    return (
        <><LoginPageComponent loginUser={loginUser} dispatch={dispatch} loggedInUser={loggedInUser}/></>
    )
}