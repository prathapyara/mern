import { Outlet } from "react-router-dom"
import { UserChatComponent } from "./UserChatComponent"

export const RouterWithUserChatComponent=()=>{
    return <><UserChatComponent/><Outlet/></>
}