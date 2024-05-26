import { UserProfilePageComponent } from './components/userProfilePageComponent';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loggedInUser } from '../../redux/actions/userAction';

export const UserProfilePage = () => {
    
    const dispatch=useDispatch();
    const {userInfo}= useSelector((state)=>state.user);

    const fetchUserProfile=async(id)=>{
        const {data}=await axios.get("/api/users/profile/");
        return data;
    }

    const updateUserProfile=async(firstName,lastName,phoneNumber,address,country,zipCode,city,state,password)=>{
        const {data}=await axios.put("/api/users/profile/",{firstName,lastName,phoneNumber,address,country,zipCode,city,state,password});
        return data;
    }

    return (
        <>
            <UserProfilePageComponent  fetchUserProfile={fetchUserProfile} updateUserProfile={updateUserProfile} dispatch={dispatch} loggedInUser={loggedInUser} localStorage={window.localStorage} sessionStorage={window.sessionStorage} userInfo={userInfo}/>
        </>
    );
}