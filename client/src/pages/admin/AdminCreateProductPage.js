import { AdminCreateProductPageComponent } from './components/AdminCreateProductPageComponent.js';
import axios from "axios";
import { uploadImageApiCall } from '../../utils/utilisCloudinary.js';
import { uploadImagesCloudinaryApiRequest } from '../../utils/utilisCloudinary.js';
import { useSelector } from 'react-redux';
import { insertCategory } from '../../redux/actions/caterogiesAction.js';
import { deleteCategory } from '../../redux/actions/caterogiesAction.js';
import { saveAttributeCategory } from '../../redux/actions/caterogiesAction';

export const AdminCreateProductPage = () => {

    const createProduct=async(productInfo)=>{
        const {data}=await axios.post("/api/products/admin",{...productInfo}); 
        return data;
    }

    const {categories}=useSelector((state)=>state.categories);

    return (
        <>
            <AdminCreateProductPageComponent createProduct={createProduct} uploadImageApiCall={uploadImageApiCall} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest} categories={categories} insertCategory={insertCategory} deleteCategory={deleteCategory} saveAttributeCategory={saveAttributeCategory}/>
        </>
    );
}
