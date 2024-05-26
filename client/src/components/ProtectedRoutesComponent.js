import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { UserChatComponent } from "./user/UserChatComponent";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export const ProtectedRoutesComponent = () => {

    const [isAuth, setIsAuth] = useState();
    const [isAdmin, setIsAdmin] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get("/api/get-token").then((data) => {

            if (data.data.tokenUserName) {
                //here in isAuth we get username stored that mean one user is login so we can have access to all the user oulet pages if the user is not an admin
                setIsAuth(data.data.tokenUserName);
                //same as above but here user will have access to admin outlet pages
                setIsAdmin(data.data.isAdmin);
            }
            return isAuth;
        }).catch((err) => {
            sessionStorage.clear("userInfo");
            localStorage.clear("userInfo");
            console.log(err);
            console.log("i am in protection");
        })
    }, [isAuth]);

    if (isAuth === undefined) {
        return <LoginPage />
    }

    return isAuth && isAdmin ? (
        <Outlet />
    ) : isAuth && !isAdmin ? <>

        <Outlet />
    </> : <><Navigate to="/login" /></>
}