import { HomePageComponent } from "./components/HomePageComponent.js"
import { useSelector } from "react-redux"
import axios from "axios";

export const HomePage = () => {

    const bestseller=async()=>{
        const {data}=await axios.get("/api/products/bestsellers");
        return data;
    }

    const {categories}=useSelector((state)=>state.categories);
    
    return (
        <>
        <HomePageComponent categories={categories} bestseller={bestseller}/>
        </>
    )
}