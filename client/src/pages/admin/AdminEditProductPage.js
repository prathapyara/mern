import { AdminEditProductPageComponent } from './components/AdminEditProductPageComponent';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { saveAttributeCategory } from '../../redux/actions/caterogiesAction';
import { category_list } from '../../redux/actions/caterogiesAction';
import { uploadImageApiCall } from '../../utils/utilisCloudinary';
import { uploadImagesCloudinaryApiRequest } from '../../utils/utilisCloudinary';

export const AdminEditProductPage = () => {

    const { categories } = useSelector((state) => state.categories);

    const fetchProduct = async (id) => {
        const { data } = await axios.get(`/api/products/get-one/${id}`);
        return data;
    }

    const updateProduct = async (updatedProduct, id) => {
        const { data } = await axios.patch(`/api/products/admin/${id}`, updatedProduct);
        return data;
    }

    const deleteImage = async (imagePath, productId) => {
        let encoded = encodeURIComponent(imagePath);
        if (process.env.NODE_ENV === "production") {
            const { data } = await axios.delete(`/api/products/admin/image/${encoded}/${productId}`);
            return data;
        } else {
            const { data } = await axios.delete(`/api/products/admin/image/${encoded}/${productId}?cloudinary=true`)
            return data;
        }

    }

    //here we not using the logic of cloudinary as we getting some problem in uploading the files

    return (
        <>
            <AdminEditProductPageComponent categories={categories} fetchProduct={fetchProduct} updateProduct={updateProduct} saveAttributeCategory={saveAttributeCategory} category_list={category_list} uploadImagesApiRequest={uploadImageApiCall} deleteImageCall={deleteImage} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest} />
        </>
    );
}
