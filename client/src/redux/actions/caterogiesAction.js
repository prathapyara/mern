import { CATEGORY_LIST } from "../constant/constant";
import { SAVE_ATTR } from "../constant/constant";
import { INSERT_CATERGORY } from "../constant/constant";
import { DELETE_CATEGORY } from "../constant/constant";
import axios from "axios";

export const category_list=()=>async(dispatch)=>{
    const {data}=await axios.get("/api/category/");
    dispatch({
        type:CATEGORY_LIST,
        payload:data,
    })
}

export const saveAttributeCategory=(key,value,categoryChoosen)=>async(dispatch)=>{
    
    const {data}=await axios.post("/api/category/newAttrs/",{
        key:key,
        val:value,
        categoryChoosen:categoryChoosen
    });
    dispatch({
        type:SAVE_ATTR,
        payload:data.categories,
    })
}

export const insertCategory=(newCategory)=>async(dispatch)=>{
    const {data}=await axios.post("/api/category",{
        category:newCategory
    });

    dispatch({
        type:INSERT_CATERGORY,
        payload:data
    })
}

export const deleteCategory=(category)=>async(dispatch)=>{
    const {data}=await axios.delete(`/api/category/${category}`);

    dispatch({
        type:DELETE_CATEGORY,
        payload:data
    })
}
