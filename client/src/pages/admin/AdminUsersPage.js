import { UserPageComponent } from "./components/userPageComponent.js";
import axios from "axios";

export const AdminUsersPage = () => {

    const fetchUser = async (abctrl) => {
        const { data } = await axios.get("/api/users");
        return data;
    }

    const deleteUser = async (userId) => {
        const { data } = await axios.delete(`/api/users/${userId}`);
        return data;
    }

    return (
        <UserPageComponent fetchUser={fetchUser} deleteUser={deleteUser} />
    );
}

// {
//     signal:abctrl.signal,
// }

