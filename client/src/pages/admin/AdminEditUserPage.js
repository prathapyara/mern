import { UserEditPageComponent } from "./components/UserEditPageComponent";
import axios from "axios";
import { useParams } from "react-router-dom";

export const AdminEditUserPage = () => {
   
    const {id}=useParams();

    const fetchAdmin=async()=>{
        const {data}=await axios.get(`/api/users/${id}`);
        return data;
    }

    const updateAdmin=async(updatedData)=>{
        const {data}=await axios.patch(`/api/users/${id}`,updatedData);
        return data; 
    }
    
    return (
        <>
            <UserEditPageComponent fetchAdmin={fetchAdmin} updateAdmin={updateAdmin}/>
        </>
    );
}
